package org.broadinstitute.orsp

import grails.gorm.PagedResultList
import grails.gorm.transactions.Transactional
import grails.util.Environment
import groovy.sql.Sql
import groovy.util.logging.Slf4j
import org.apache.commons.lang.StringUtils
import org.broadinstitute.orsp.webservice.Ontology
import org.broadinstitute.orsp.webservice.PaginatedResponse
import org.broadinstitute.orsp.webservice.PaginationParams
import org.apache.commons.collections.CollectionUtils
import org.hibernate.Criteria
import org.hibernate.FetchMode
import org.hibernate.HibernateException
import org.hibernate.MappingException
import org.hibernate.NonUniqueResultException
import org.hibernate.SQLQuery
import org.hibernate.SessionFactory
import org.hibernate.transform.Transformers

import javax.sql.DataSource
import java.sql.SQLException

/**
 * This class should handle generic domain class queries and avoid persistence updates.
 *
 * In general, favor Groovy sql (using dataSource) or hibernate sql (using sessionFactory) over GORM
 * when dealing with collections.
 *
 */
@Slf4j
@Transactional(readOnly = true)
class QueryService implements Status {

    def grailsApplication
    DataSource dataSource
    OntologyService ontologyService
    UserService userService
    SessionFactory sessionFactory
    ConsentService consentService
    StatusEventService statusEventService
    public static String PROJECT_KEY_PREFIX

    static {
        switch (Environment.current) {
            case Environment.PRODUCTION:
                PROJECT_KEY_PREFIX = ""
                break
            default:
                PROJECT_KEY_PREFIX = "DEV-"
                break
        }
    }

    /**
     * Constructs an SQL instance using the default DataSource. Each operation
     * will use a Connection from the DataSource pool and close it when the
     * operation is completed putting it back into the pool.
     */
    private Sql getSqlConnection() {
        new Sql(dataSource)
    }

    SubsystemStatus getStatus() {
        SubsystemStatus mysql = new SubsystemStatus()
        try {
            mysql.ok = getSqlConnection().execute("SELECT 1")
        } catch (SQLException e) {
            mysql.ok = false
            mysql.messages = [e.getMessage()]
        }
        mysql
    }

    /**
     * Get a distinct list of current disease restrictions.
     * @return List of distinct disease terms
     */
    Collection<String> findAllDiseaseAndPopulationRestrictions() {
        final String query =
                ' select distinct disease_restrictions_string from data_use_restriction_disease_restrictions ' +
                ' union ' +
                ' select distinct disease_restrictions_string from data_use_restriction_disease_restrictions '
        getSqlConnection().rows(query).collect { it.get("disease_restrictions_string").toString() }
    }

    /**
     * Get a list of metrics information
     * @return List of AAHRPPMetrics data
     */
    @SuppressWarnings("GroovyAssignabilityCheck")
    Collection<AAHRPPMetrics> findAllAAHRPPMetrics() {
        final String query =
                " select i.id, i.project_key, i.summary, rc.value as 'review-category', u.display_name, " +
                        " irb.value as 'irb', f.name, f.source, protocol.value as 'protocol' " +
                        " from issue i " +
                        " left outer join funding f on f.issue_id = i.id " +
                        " left outer join issue_extra_property pi on pi.issue_id = i.id and pi.name = 'pi' " +
                        " left outer join user u on u.user_name = pi.value " +
                        " left outer join issue_extra_property irb on irb.issue_id = i.id and irb.name = 'irb' " +
                        " left outer join issue_extra_property rc on rc.issue_id = i.id and rc.name = 'review-category' " +
                        " left outer join issue_extra_property protocol on protocol.issue_id = i.id and protocol.name = 'protocol' " +
                        " order by i.id asc "
        Map<String, AAHRPPMetrics> metricsMap = new LinkedHashMap<>()
        getSqlConnection().rows(query).each {
            // Summary and ProjectKey are the only guaranteed non-nullable fields
            AAHRPPMetrics metric = new AAHRPPMetrics(
                    summary: it.get("summary").toString(),
                    projectKey: it.get("project_key").toString()
            )
            if (it.get("review-category") != null)  metric.reviewCategory = it.get("review-category").toString()
            if (it.get("protocol") != null)         metric.protocol = it.get("protocol").toString()
            if (it.get("irb") != null)              metric.irb = PreferredIrb.getLabelForKey(it.get("irb").toString())
            if (it.get("name") != null && !it.get("name").toString().trim().isEmpty())
                metric.names.add(it.get("name").toString())
            if (it.get("display_name") != null && !it.get("display_name").toString().trim().isEmpty())
                metric.displayNames.add(it.get("display_name").toString())
            if (it.get("source") != null && !it.get("source").toString().trim().isEmpty())
                metric.sources.add(it.get("source").toString())
            // Merge duplicate metrics into current map:
            if (metricsMap.containsKey(metric.projectKey)) {
                AAHRPPMetrics previousMetric = metricsMap.get(metric.projectKey)
                previousMetric.names.addAll(metric.names)
                previousMetric.displayNames.addAll(metric.displayNames)
                previousMetric.sources.addAll(metric.sources)
                metricsMap.put(previousMetric.projectKey, previousMetric)
            } else {
                metricsMap.put(metric.projectKey, metric)
            }
        }
        metricsMap.values()
    }

    /**
     * Find all sample collection ids that have been associated to the provided consent.
     *
     * @return Collection of distinct sample collection ids
     */
    Collection<String> findAllSampleCollectionIdsForConsent(String consentKey) {
        final String query =
                ' select distinct TRIM(sample_collection_id) as sample_collection_id ' +
                ' from consent_collection_link ' +
                ' where consent_key = :consentKey ' +
                ' and sample_collection_id is not null '
        getSqlConnection().rows(query, ["consentKey": consentKey]).collect { it.get("sample_collection_id").toString() }
    }

    /**
     * Check if all the links related to the specifiend consent and project key are been approved.
     *
     * @return boolean, true if links are been approved
     */
    boolean areLinksApproved(String projectKey, String consentKey) {
        final String query =
                ' select distinct status as status ' +
                        ' from consent_collection_link ' +
                        ' where consent_key = :consentKey ' +
                        ' and project_key = :projectKey ' +
                        ' and status = :status '
        getSqlConnection().rows(query, ["projectKey": projectKey, "consentKey": consentKey, status: CollectionLinkStatus.APPROVED.name])
                .collect { it.get("status").toString() }?.size() > 0
    }

    @SuppressWarnings(["GrUnresolvedAccess", "GroovyAssignabilityCheck"]) // IJ has some problems here.
    PaginatedResponse queryFundingReport(PaginationParams pagination) {
        Integer count = Funding.count()

        String orderField
        switch(pagination.orderColumn) {
            case 0:
                orderField = "issue.type"
                break
            case 1:
                orderField = "issue.id" // This is displayed as projectKey, but for sorting, we use the id field.
                break
            case 2:
                orderField = "issue.summary"
                break
            case 3:
                orderField = "issue.status"
                break
//            case 4: Not easily sortable or filterable
//            case 5: Not easily sortable or filterable
            case 6:
                orderField = "source"
                break
            case 7:
                orderField = "name"
                break
            case 8:
                orderField = "awardNumber"
                break
            default:
                orderField = "issue.type"
                break
        }

        PagedResultList<Funding> fundingResults = Funding.
                createCriteria().
                list(max: pagination.length, offset: pagination.start) {
            fetchMode 'issue', FetchMode.JOIN
            fetchMode 'issue.extraProperties', FetchMode.SELECT
            createAlias('issue', 'issue')
            maxResults pagination.length
            firstResult pagination.start
            order(orderField, pagination.sortDirection)
            if (pagination.searchValue) {
                or {
                    ilike("issue.type", pagination.getLikeTerm())
                    ilike("issue.projectKey", pagination.getLikeTerm())
                    ilike("issue.summary", pagination.getLikeTerm())
                    ilike("issue.status", pagination.getLikeTerm())
                    ilike("source", pagination.getLikeTerm())
                    ilike("name", pagination.getLikeTerm())
                    ilike("awardNumber", pagination.getLikeTerm())
                }
            }
        }

        List<Funding> fundings = fundingResults.findAll()
        List<String> piUserNames = fundings*.issue*.getPIs().flatten().unique()
        Map<String, String> userMap = new HashMap<>()
        if (!piUserNames.isEmpty()) {
            User.findAllByUserNameInList(piUserNames).each { userMap.put(it.userName, it.displayName) }
        }

        new PaginatedResponse(
                draw: pagination.draw,
                recordsTotal: count,
                recordsFiltered: fundingResults.getTotalCount(),
                data: fundings,
                error: ""
        )
    }

    Collection<Funding> getAllFundings() {
        final session = sessionFactory.currentSession
        final String query = ' select * from funding '
        final sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with {
            addEntity(Funding)
            list()
        }
        results as Collection<Funding>
    }

    private Map<String, SampleCollection> getCollectionIdMap(Collection<ConsentCollectionLink> links) {
        Collection<String> sampleCollectionIds = links.collect { it.sampleCollectionId }.findAll { it && !it.isEmpty()}
        Map<String, SampleCollection> collectionMap = new HashMap<>()
        if (!sampleCollectionIds.isEmpty()) {
            collectionMap.putAll(
                    SampleCollection.
                            findAllByCollectionIdInList(sampleCollectionIds).
                            collectEntries { [it.collectionId, it] }
            )
        }
        collectionMap
    }

    Collection<ConsentCollectionLink> findCollectionLinksByProjectKey(String projectKey) {
        Issue project = findByKey(projectKey)
        Collection<ConsentCollectionLink> links = ConsentCollectionLink.findAllByProjectKey(projectKey)
        Map<String, SampleCollection> collectionMap = getCollectionIdMap(links)
        Collection<DataUseRestriction> durs = new ArrayList<>()
        if (!links.collect { it.consentKey }.isEmpty()) {
            durs.addAll(DataUseRestriction.findAllByConsentGroupKeyInList(links.collect { it.consentKey }))
        }

        links.each { link ->
            if (link.sampleCollectionId && collectionMap.containsKey(link.sampleCollectionId)) {
                link.setSampleCollection(collectionMap.get(link.sampleCollectionId))
            }
            link.setLinkedProject(project)
            link.setRestriction(durs.find { it.consentGroupKey == link.consentKey })
        }
        links
    }

    Collection<ConsentCollectionLink> findCollectionLinksByConsentKey(String consentKey) {
        Collection<ConsentCollectionLink> links = ConsentCollectionLink.findAllByConsentKey(consentKey)
        Map<String, SampleCollection> collectionMap = getCollectionIdMap(links)
        Collection<String> projectKeys = links.collect { it.projectKey }
        Collection<String> consentKeys = links.collect { it.consentKey }
        Collection<Issue> projects
        if (projectKeys && !projectKeys.isEmpty()) {
            projects = Issue.findAllByProjectKeyInList(projectKeys)
        }
        Collection<DataUseRestriction> durs
        if (consentKeys && !consentKeys.isEmpty()) {
            durs = DataUseRestriction.findAllByConsentGroupKeyInList(consentKeys)
        }
        links.each { link ->
            if (link.sampleCollectionId && collectionMap.containsKey(link.sampleCollectionId)) {
                link.setSampleCollection(collectionMap.get(link.sampleCollectionId))
            }
            link.setLinkedProject(projects.find { it.projectKey == link.projectKey })
            link.setRestriction(durs.find { it.consentGroupKey == link.consentKey })
        }
        links
    }


    Collection<Object> getCCLSummaries() {
        final String query =
                " select distinct ccl.consent_key, ccl.project_key, concat(ccl.sample_collection_id, ' - ', s.name) as 'sample_collection_id' " +
                        " from consent_collection_link ccl " +
                        " left outer join sample_collection s on s.collection_id = ccl.sample_collection_id "
        getSqlConnection().rows(query).collect()
    }

    Collection<ConsentCollectionLink> findCollectionLinks(String projectKey, String consentKey, String sampleCollectionId) {
        final session = sessionFactory.currentSession
        final String query =
                ' select * ' +
                        ' from consent_collection_link c ' +
                        ' where c.project_key = :projectKey ' +
                        ' and c.consent_key = :consentKey ' +
                        ' and c.sample_collection_id = :sampleCollectionId '
        final sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with {
            addEntity(ConsentCollectionLink)
            setString('projectKey', projectKey)
            setString('consentKey', consentKey)
            setString('sampleCollectionId', sampleCollectionId)
            list()
        }
        results as Collection<ConsentCollectionLink>
    }

    Collection<ConsentCollectionLink> findConsentCollectionLinksByProjectKeyAndConsentKey(String projectKey, String consentKey) {
        final session = sessionFactory.currentSession
        final String query =
                ' select * ' +
                        ' from consent_collection_link c ' +
                        ' where c.project_key = :projectKey ' +
                        ' and c.consent_key = :consentKey '
        final sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with {
            addEntity(ConsentCollectionLink)
            setString('projectKey', projectKey)
            setString('consentKey', consentKey)
            list()
        }
        results as Collection<ConsentCollectionLink>
    }

    Collection<ConsentCollectionLink> findCollectionLinkById(String consentCollectionLinkId) {
        final session = sessionFactory.currentSession
        final String query =
                ' select * from consent_collection_link c ' +
                        ' where c.id = :consentCollectionLinkId '
        final sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with {
            addEntity(ConsentCollectionLink)
            setString('consentCollectionLinkId', consentCollectionLinkId)
            list()
        }
        results as Collection<ConsentCollectionLink>
    }

    @SuppressWarnings(["GroovyAssignabilityCheck"])
    Map<ConsentCollectionLinkDTO, List<StorageDocument>> findSpecificCollectionLink(String consentCollectionId) {
        Map<ConsentCollectionLink, List<StorageDocument>> sampleInfo = new HashMap<>()
        final session = sessionFactory.currentSession
        final String query =
            ' select c.id id, c.consent_key consentKey, c.project_key linkedProjectKey, c.pii pii, c.compliance compliance, c.sharing_type sharingType , c.text_sharing_type textSharingType, ' +
                    ' c.text_compliance textCompliance, c.require_mta requireMta, c.sample_collection_id sampleCollectionId, ' +
                    ' c.phi phi, c.pii_dt piiDt, c.text_store textStore, c.publicly_available publiclyAvailable, c.store store, c.external_availability externalAvailability, c.genomic_data genomicData, ' +
                    ' sc.name collectionName, sc.category collectionCategory, sc.group_name collectionGroup, ic.summary consentName, ip.summary projectName, c.international_cohorts internationalCohorts, ' +
                    ' ip.type projectType, c.start_date startDate, c.end_date endDate, c.on_going_process onGoingProcess, ' +
                    ' c.names names, c.dates dates, c.telephone telephone, c.geographic_data geographicData, c.fax fax, c.social_security_number socialSecurityNumber, c.email_addresses emailAddresses, ' +
                    ' c.medical_numbers medicalNumbers, c.account_numbers accountNumbers, c.health_plan_numbers healthPlanNumbers, c.license_numbers licenseNumbers, c.vehicle_identifiers vehicleIdentifiers, ' +
                    ' c.web_urls webUrls, c.device_identifiers deviceIdentifiers, c.internet_protocol_addresses internetProtocolAddresses, c.face_photos facePhotos, c.biometric_identifiers biometricIdentifiers, ' +
                    ' c.unique_identifying uniqueIdentifying, c.other_identifier otherIdentifier, c.text_other_identifier textOtherIdentifier ' +
                    ' from consent_collection_link c ' +
                    ' inner join issue ic on ic.project_key = c.consent_key ' +
                    ' inner join issue ip on ip.project_key = c.project_key ' +
                    ' left join sample_collection sc on sc.collection_id = c.sample_collection_id ' +
                    ' where c.id = :consentCollectionId and c.deleted = 0'
        List<ConsentCollectionLinkDTO> result = session.createSQLQuery(query)
                .setResultTransformer(Transformers.aliasToBean(ConsentCollectionLinkDTO.class))
                .setString('consentCollectionId', consentCollectionId)
                .list()
        if (!result.isEmpty()) {
            Map<Long, List<StorageDocument>> storageDocuments = findAllDocumentsBySampleCollectionId(result.first().id)
            sampleInfo.put(result.first(), storageDocuments.getOrDefault(result.first().id, []))
        }
        sampleInfo
    }

    @SuppressWarnings(["GroovyAssignabilityCheck"])
    Map<Long, List <StorageDocument>> findAllDocumentsBySampleCollectionId(Long consentCollectionId) {
        final session = sessionFactory.currentSession
        final String query =
                ' select * from storage_document ' +
                ' where consent_collection_link_id = :consentCollectionIds' +
                ' and deleted = 0'
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with {
            addEntity(StorageDocument)
            setLong('consentCollectionIds', consentCollectionId)
            list()
        }
        results.groupBy { it?.consentCollectionLinkId }
    }

    List <StorageDocument> findAllDocumentsBySampleCollectionIdList(List<Long> consentCollectionId) {
            final session = sessionFactory.currentSession
            final String query =
                    ' select * from storage_document ' +
                            ' where consent_collection_link_id in :consentCollectionIds' +
                            ' and deleted = 0'
            final SQLQuery sqlQuery = session.createSQLQuery(query)
            CollectionUtils.isNotEmpty(consentCollectionId) ?
                    sqlQuery.with {
                addEntity(StorageDocument)
                setParameterList('consentCollectionIds', consentCollectionId)
                list()
            } : Collections.emptyList()
    }

    List<ConsentCollectionLinkDTO> getCollectionLinksDtoByConsentKey(String consentKey) {
        final session = sessionFactory.currentSession
        final String query =
        ' select c.id id, c.consent_key consentKey, c.project_key linkedProjectKey, c.pii pii, c.compliance compliance, c.sharing_type sharingType , c.text_sharing_type textSharingType,  ' +
                ' c.text_compliance textCompliance, c.require_mta requireMta, c.sample_collection_id sampleCollectionId, ' +
                ' sc.name collectionName, sc.category collectionCategory, sc.group_name collectionGroup, ic.summary consentName, ip.summary projectName, ip.type projectType, c.international_cohorts internationalCohorts ' +
                ' from consent_collection_link c ' +
                ' inner join issue ic on ic.project_key = c.consent_key ' +
                ' inner join issue ip on ip.project_key = c.project_key ' +
                ' left join sample_collection sc on sc.collection_id = c.sample_collection_id' +
                ' where c.consent_key = :consentKey and c.deleted = 0'
        List<ConsentCollectionLinkDTO> results = session.createSQLQuery(query)
                .setResultTransformer(Transformers.aliasToBean(ConsentCollectionLinkDTO.class))
                .setString('consentKey', consentKey)
                .list()
        results
    }

    boolean updateCollectionLinkStatus(String consentKey, String projectKey, String status) {
        final session = sessionFactory.currentSession
        final String query =
                ' update consent_collection_link set status = :status ' +
                'where project_key = :projectKey and consent_key = :consentKey'
        final sqlQuery = session.createSQLQuery(query)
        sqlQuery.setParameter('projectKey', projectKey)
        sqlQuery.setParameter('consentKey', consentKey)
        sqlQuery.setParameter('status', status)
        int rowsUpdated = sqlQuery.executeUpdate()
        rowsUpdated > 0
    }

    Collection<ConsentCollectionLink> findCollectionLinksBySample(String sampleCollectionId) {
        final session = sessionFactory.currentSession
        final String query =
                ' select * ' +
                        ' from consent_collection_link c ' +
                        ' where c.sample_collection_id = :sampleCollectionId '
        final sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with {
            addEntity(ConsentCollectionLink)
            setString('sampleCollectionId', sampleCollectionId)
            list()
        }
        results as Collection<ConsentCollectionLink>
    }

    Collection<ConsentCollectionLink> findCollectionLinksWithSamples() {
        Collection<ConsentCollectionLink> links = ConsentCollectionLink.findAll()
        Collection<SampleCollection> sampleCollections = SampleCollection.
                findAllByCollectionIdInList(links.collect { it.sampleCollectionId }.findAll { it && !it.isEmpty()})
        Collection<Issue> projects = Issue.findAllByProjectKeyInList(links.collect { it.projectKey })
        Collection<DataUseRestriction> durs = DataUseRestriction.findAllByConsentGroupKeyInList(links.collect { it.consentKey })
        links.each { link ->
            if (link.sampleCollectionId) {
                link.setSampleCollection(sampleCollections.find { it.collectionId == link.sampleCollectionId })
            }
            link.setLinkedProject(projects.find { it.projectKey == link.projectKey })
            link.setRestriction(durs.find { it.consentGroupKey == link.consentKey })
        }
        links
    }

    List findIssuesBySearchTermAsProjectKey(String term) {
        // For backwards compatibility with existing "ORSP" prefixes, ignore the prefix and like-clause on the identifier
        String issueNumber = getIssueNumberFromString(term)
        if (StringUtils.isEmpty(issueNumber)) { return Collections.emptyList() }
        String iLikeTerm = "%" + issueNumber + "%"
        Issue.findAllByProjectKeyIlike(iLikeTerm).collect {
            [id             : it.id,
             projectKey     : it.projectKey,
             summary        : it.summary,
             reporter       : it.reporter,
             pm             : userService.findUsers(it.getPMs()).displayName,
             actor          : userService.findUsers(it.getActorUsernames()).displayName,
             extraProperties: it.extraPropertiesMap,
             controller     : it.controller,
             type           : it.type
            ]
        }
    }

    // Simplified project key autocomplete query
    List<Map> projectKeyAutocomplete(String term) {
        // For backwards compatibility with existing "ORSP" prefixes, ignore the prefix and like-clause on the identifier
        String iLikeTerm = "%" + getIssueNumberFromString(term) + "%"
        final String query = ' select distinct i.project_key, i.summary, i.type from issue i where i.project_key like :projectKey '
        getSqlConnection().rows(query, ['projectKey': iLikeTerm]).collect {
            [projectKey: it.get("project_key").toString(),
             summary: it.get("summary").toString(),
             type: it.get("type").toString()]
        }
    }

    Collection<SampleCollection> getUnConsentedSamples() {
        final String query = 'select * from sample_collection where collection_id not in ' +
                '(select distinct TRIM(sample_collection_id) from consent_collection_link where sample_collection_id is not null)'
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with {
            addEntity(SampleCollection)
            list()
        }
        results
    }

    Collection<SampleCollection> findCollectionsBySearchTerm(String term) {
        if (term) {
            final String query = 'select * from sample_collection ' +
                    ' where lower(collection_id) like :term ' +
                    ' or lower(name) like :term ' +
                    ' or lower(category) like :term ' +
                    ' or lower(group_name) like :term '
            SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
            final session = sessionFactory.currentSession
            final SQLQuery sqlQuery = session.createSQLQuery(query)
            final results = sqlQuery.with {
                addEntity(SampleCollection)
                setString('term', '%' + term.toLowerCase() + '%')
                list()
            }
            results
        } else {
            Collections.EMPTY_LIST
        }
    }

    SampleCollection findCollectionById(String id) {
        if (id) {
            final String query = 'select * from sample_collection ' +
                    ' where lower(collection_id) = lower(:id) '
            SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
            final session = sessionFactory.currentSession
            final SQLQuery sqlQuery = session.createSQLQuery(query)
            final results = sqlQuery.with {
                addEntity(SampleCollection)
                setString('id', id.toLowerCase())
                list()
            }
            if (results?.size() > 0) {
                results.get(0)
            } else {
                null
            }
        } else {
            null
        }
    }

    Collection<SampleCollection> findCollectionByIdInList(Collection<String> idList) {
        if (!idList.isEmpty()) {
            final String query = 'select * from sample_collection ' +
                                 'where lower(collection_id) IN :collectionIds'
            SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
            final session = sessionFactory.currentSession
            final SQLQuery sqlQuery = session.createSQLQuery(query)
            final results = sqlQuery.with {
                addEntity(SampleCollection)
                setParameterList('collectionIds', idList)
                list()
            }
            results
        } else {
            null
        }
    }

    List<String> getConsentGroupSummaries() {
        Issue.findAllByType(IssueType.CONSENT_GROUP.name, [cache: true])*.summary
    }

    /**
     * Search for issues by partial term match.
     *
     * @param term The search term
     * @return List of issues that match term
     */
    List<Issue> findProjectsBySearchTerm(String term, Collection<String> typeNames) {
        def likeTerm = generateILikeTerm(term)
        Issue.withCriteria {
            inList("type", typeNames)
            or {
                ilike "projectKey", likeTerm
                ilike "summary", likeTerm
                ilike "description", likeTerm
            }
            order("id", "asc")
        } as List<Issue>
    }

    /**
     * Find an issue by its key
     *
     * @param key The issue key
     * @return Issue that match the query
     */
    Issue findByKey(String key) {
        def issue = Issue.findByProjectKey(key) ?: null
        if (issue) {
            issue.actors = userService.findUsers(issue.getActorUsernames())*.displayName ?: Collections.emptyList()
            issue.setAttachments(getAttachmentsForProject(key))
        }
        issue
    }

    /**
     * Find issues by keys
     *
     * @param keys The issue keys
     * @return List of Issues that match the query
     */
    Collection<ConsentLinkDTO> findByKeys(Map<String, ConsentCollectionLink> keys, String projectKey) {
        if (!keys?.isEmpty()) {
            List<Issue> issues = findAllByProjectKeyInList(keys.keySet().toList(), null)
            List<StorageDocument> documents = getAttachmentsForProjects(keys.keySet())
            def docsByProject = documents.groupBy({d -> d.projectKey})
            List<ConsentLinkDTO> consentLinkDTOList = new ArrayList<>()
            issues.each { issue ->
              consentLinkDTOList.add(
                      new ConsentLinkDTO(issue.id,
                                         issue.projectKey,
                                         keys.get(issue.projectKey).status,
                                         issue.summary,
                                         issue.description,
                                         docsByProject.get(issue.projectKey) != null ? docsByProject.get(issue.projectKey) : Collections.emptyList()))
            }
            consentLinkDTOList
        } else {
            Collections.emptyList()
        }
    }

    /**
     * Find paginated and filtered project issues
     *
     * @return Issues that match the query
     */
    @SuppressWarnings(["GroovyAssignabilityCheck"])
    List<StatusEventDTO> findIssuesForStatusReport(Collection<String> issueTypeNames) {
        if (issueTypeNames.isEmpty()) {
            log.error("An error has occurred trying to find Issue Types from empty list for Quality Assurance Report.")
            throw new IllegalArgumentException("Error trying to fetch Projects by unspecified type.")
        }
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final StringBuffer query = new StringBuffer(' select distinct * from issue i where i.deleted = 0 and i.type != :consentGroup and i.type IN :filterType ')
        SQLQuery sqlQuery = session.createSQLQuery(query.toString())
        sqlQuery.setString('consentGroup', IssueType.CONSENT_GROUP.name)
        sqlQuery.setParameterList('filterType', issueTypeNames)
        List<Issue> issues = sqlQuery.addEntity(Issue).list()
        List<StatusEventDTO> statusEvents = new ArrayList<>()
        if (CollectionUtils.isNotEmpty(issues)) {
            statusEvents = statusEventService.getStatusEventsForProjectList(issues)
        }
        statusEvents
    }

    /**
     * Search consent issues by partial name match.
     *
     * @param term The search term
     * @return List of issues that match term
     */
    List<Issue> findIssuesByConsentTerm(String term) {
        def likeTerm = generateILikeTerm(term)
        Issue.withCriteria {
                eq("type", IssueType.CONSENT_GROUP.name)
                or {
                    ilike "summary", likeTerm
                    ilike "description", likeTerm
                }
                order("id", "asc")
        }.unique()
    }

    /**
     * Find all issues by user assignee and optionally limit by max
     *
     * @param userNames
     * @param max
     * @return List of JiraIssues that match the query
     */
    List<Issue> findByAssignee(Collection<String> userNames, Integer max) {
        if (userNames.isEmpty()) { return Collections.emptyList() }
        List<String> keys = IssueExtraProperty.findAllByNameAndValueInList(IssueExtraProperty.ACTOR, userNames.asList(), [:])?.collect { it.projectKey }
        if (keys.isEmpty()) { return Collections.emptyList() }
        findAllByProjectKeyInList(keys, max)
    }

    /**
     * Find all issues by project key and optionally limit by max
     *
     * @param projectKeys
     * @param max
     * @return List of Issues that match the query
     */
    List<Issue> findAllByProjectKeyInList(List<String> projectKeys, Integer max) {
        if (CollectionUtils.isEmpty(projectKeys)) { return  Collections.emptyList() }
        String query = 'select * from issue where project_key IN (:projectKeys) and deleted = 0 order by update_date desc '
        if (max) { query = query + ' limit ' + max }
        SQLQuery sqlQuery = getSessionFactory().currentSession.createSQLQuery(query)
        List<Issue> issues = sqlQuery.with {
            setParameterList('projectKeys', projectKeys)
            addEntity(Issue)
            list()
        }
        issues
    }

    /**
     * Find all issues by user and optionally limit by max
     *
     * @param userNames
     * @param max
     * @return List of JiraIssues that match the query
     */
    List<Issue> findByUserNames(Collection<String> userNames, Integer max) {
        if (userNames.isEmpty()) { return Collections.emptyList() }
        List<String> propertyNames = [IssueExtraProperty.ACTOR, IssueExtraProperty.PM, IssueExtraProperty.PI]
        List<String> keys = IssueExtraProperty.findAllByNameInListAndValueInList(propertyNames, userNames.asList(), [:])?.collect { it.projectKey }
        if (keys.isEmpty()) { return Collections.emptyList() }
        findAllByProjectKeyInList(keys, max)
    }

    /**
     * Find all issue using a populated QueryOptions object.
     * All fields in QueryOptions can be used in a search.
     *
     * Uses direct sql to find all issue ids and then re-queries on those ids.
     * Much faster than the hibernate criteria approach in 'QueryService.findByQueryOptions'
     *
     * @param queryOptions A QueryOptions object that has desired fields populated.
     * @return List of Issues that match the query
     */
    Set<Issue> findIssues(QueryOptions options) {
        // TODO: double check that prepared statements will really sanitize the input
        // TODO: Handle all of the other query types both as input arguments and in the following query
        String query = ' select distinct i.id ' +
                ' from issue i ' +
                ' left outer join issue_extra_property p on p.issue_id = i.id ' +
                ' left outer join user u on p.value = u.user_name ' +
                ' left outer join funding f on f.project_key = i.project_key ' +
                ' left outer join consent_collection_link ccl on ccl.consent_key =  i.project_key ' +
                ' where '

        // TODO: Streamline the parameterization here, perhaps with a QueryOptions utility method
        Map<String, String> params = new HashMap<>()
        if (options.getFreeText()) {
            def q = ' (i.project_key like :text OR i.status like :text OR i.summary like :text OR i.description like :text OR i.reporter like :text OR p.value like :text OR u.display_name like :text) '
            query = andIfyQstring(query, q, params)
            params.put('text', "%" + options.getFreeText() + "%")
        }
        if (options.getProjectKey()) {
            def q = ' i.project_key like :projectKey '
            query = andIfyQstring(query, q, params)
            params.put('projectKey', "%" + options.getProjectKey() + "%")
        }
        if (options.getFundingInstitute()) {
            def q = ' ( f.name like :funding OR f.source like :funding OR f.award_number like :funding ) '
            query = andIfyQstring(query, q, params)
            params.put('funding', "%" + options.getFundingInstitute() + "%")
        }
        if (options.userName) {
            def q = ' (u.user_name like :userName or i.reporter like :userName)'
            query = andIfyQstring(query, q, params)
            params.put('userName', "%" + options.userName + "%")
        }
        if (options.getIssueTypeNames() && !options.getIssueTypeNames().empty) {
            def q = orIfyCollection("i.type = :typeName", options.getIssueTypeNames())
            query = andIfyQstring(query, q, params)
            options.getIssueTypeNames().eachWithIndex { it, index ->
                params.put("typeName" + (index + 1), it)
            }
        }
        if (options.getIssueStatusNames() && !options.getIssueStatusNames().empty) {
            def q = orIfyStatuses("i.status = :statusName", "i.approval_status = :statusName", options.getIssueStatusNames())
            query = andIfyQstring(query, q, params)

            options.getIssueStatusNames().eachWithIndex { it, index ->
                params.put("statusName" + (index + 1), it)
            }
        }
        if (options.getIrbsOfRecord()) {
            def or = orIfyCollection("p.value = :irbOfRecord", options.getIrbsOfRecord())
            def q = ' ( p.name = "irb" AND ( ' + or + ') ) '
            query = andIfyQstring(query, q, params)
            options.getIrbsOfRecord().eachWithIndex { it, index ->
                params.put("irbOfRecord" + (index + 1), it)
            }
        }
        if (options.getCollection()) {
            def q = ' ccl.sample_collection_id like :collection '
            query = andIfyQstring(query, q, params)
            params.put('collection', "%" + options.getCollection() + "%")
        }

        def rows = getSqlConnection().rows(query, params)
        def ids = rows.collect{it.get("id")}
        Set result = new HashSet<Issue>()

        if (ids.size() > 0) {
            result = findIssuesSearchItemsDTO(ids)
        }
        result
    }

/**
 * Find issues and create DTOs to narrow the amount of data used in the search process
 * @param issueIds
 * @return Set of issues DTO that match the query, suitable to be shown in SearchResults.js
 */
    Set<IssueSearchItemDTO> findIssuesSearchItemsDTO(ArrayList<Integer> issueIds) {

        final String query = "SELECT i.id id, " +
                "i.project_key, " +
                "i.type type,  " +
                "i.status status,  " +
                "i.summary summary,  " +
                "i.reporter reporter,  " +
                "ur.display_name reporter_name, " +
                "i.approval_status,  " +
                "i.update_date updated,  " +
                "i.expiration_date expirationDate, " +
                "iep.name, " +
                "iep.value ," +
                "u.display_name " +
                "FROM issue i  " +
                "LEFT JOIN issue_extra_property iep  " +
                "ON (iep.project_key = i.project_key  " +
                "AND iep.name IN ('pm','pi','collaborator')) " +
                "LEFT JOIN user u ON (u.user_name = iep.value) " +
                "LEFT JOIN user ur ON (ur.user_name = i.reporter) " +
                "WHERE i.id IN (:issueIds) " +
                "AND i.deleted != 1"

        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final SQLQuery sqlQuery = session.createSQLQuery(query)

        final List<Object[]> results = sqlQuery.with {
            setParameterList('issueIds', issueIds)
            list()
        }
        IssueSearchItemDTO.processResults(results);
    }

    /**
     * OSAP Integration
     * Get a list of issue information
     * @return List of OSAPDataFeed data
     */
    Collection<OSAPDataFeed> findIssuesSummaries() {
        final String query =
                "select i.project_key orspNumber, irb.value irbNumber, i.status, i.expiration_date expirationDate, u.display_name pi, i.summary title " +
                "from issue i " +
                "left outer join issue_extra_property irb on i.id = irb.issue_id and irb.name = 'irb' " +
                "left outer join issue_extra_property pi on i.id = pi.issue_id and pi.name = 'pi' " +
                "left outer join user u on pi.value = u.user_name " +
                "order by i.project_key asc "
        final session = sessionFactory.currentSession
        List<OSAPDataFeed> result = session.createSQLQuery(query)
                .setResultTransformer(Transformers.aliasToBean(OSAPDataFeed.class))
                .list()
        return result
    }

    /**
     * Builds a list of named parameter subqueries which are OR-ed together
     *  ( i.type = :typeName1 OR
     *    i.type = :typeName2 OR
     *    i.type = :typeName3 OR
     *    ... )
     *
     * We like the named parameters since we can use Groovy SQL to sanitize them
     * when they are used as parameters. Safer than making an un-sanitized in-list.
     *
     * @param q
     * @param collection
     * @return
     */
    private static String orIfyCollection(String q, Collection<String> collection) {
        def count = collection.size()
        def collQs = (1 .. count).collect { q + it }
        " ( " + collQs.join(" OR ") + " ) "
    }

    private static String orIfyStatuses(String qLegacy, String qNew, Collection<String> collection) {
        def count = collection.size()
        def collQsLegacy = (1 .. count).collect { qLegacy + it }
        def collQsNew = (1 .. count).collect { qNew + it }
        " ( " + collQsLegacy.join(" OR ") + " OR " + collQsNew.join(" OR ") + " ) "
    }

    private static String andIfyQstring(String query, String q, Map params) {
        (params.size() > 0) ? query + " AND ${q} " : query + q
    }

    /**
     * Find all issue summaries
     * @return List of Issues Summaries
     */
    List findIssueSummaries() {
        final String query = 'SELECT project_key projectKey, summary, type, approval_status approvalStatus, description, status ' +
                             'FROM issue WHERE deleted = 0'
        getSqlConnection().rows(query)
    }

    /**
     * Find all issue using a populated QueryOptions object.
     * All fields in QueryOptions can be used in a search.
     *
     * @param queryOptions A QueryOptions object that has desired fields populated.
     * @return List of JiraIssues that match the query
     */
    List<Issue> findByQueryOptions(QueryOptions options) {
        Collection<Issue> results = Issue.withSession {
            Issue.withCriteria {

                if (options.issueTypeNames && !options.issueTypeNames.isEmpty()) {
                    inList("type", options.issueTypeNames)
                }

                if (options.issueStatusNames && !options.issueStatusNames.isEmpty()) {
                    inList("status", options.issueStatusNames)
                }

                // Exclude abandoned by default unless statuses are specifically requested
                if (options.ignoreAbandoned && !options.issueStatusNames) {
                    ne("status", IssueStatus.Abandoned.name)
                }

                if (options.projectKey) {
                    // For backwards compatibility with existing "ORSP" prefixes, ignore the prefix and like-clause on the identifier
                    like("projectKey", getIssueNumberFromString(options.projectKey))
                }
                eq("deleted", false)
                if (options.sortField && options.sortOrder) order(options.sortField, options.sortOrder.name())
                resultTransformer(Criteria.DISTINCT_ROOT_ENTITY)
            }
        } as Collection<Issue>

        // Apply Assignee restrictions
        if (options.assignees) {
            results.retainAll {
                issue ->
                    issue.getActorUsernames()?.intersect(options.assignees)
            }
        }

        // Apply generic user restriction
        if (options.userNames) {
            results.retainAll {
                issue ->
                    issue.getActorUsernames()?.intersect(options.userNames) ||
                            issue.getPMs()?.intersect(options.userNames) ||
                            issue.getPIs()?.intersect(options.userNames)
            }
        }

        // Apply funding filter
        if (options.fundingInstitute) {
            results.retainAll {
                issue ->
                    issue.getFundings()*.source?.any { it?.equalsIgnoreCase(options.fundingInstitute) } ||
                    issue.getFundings()*.name?.any { it?.equalsIgnoreCase(options.fundingInstitute) } ||
                    issue.getFundings()*.awardNumber?.any { it?.equalsIgnoreCase(options.fundingInstitute) }
            }
        }

        // Apply irb filter
        if (options.irbOfRecord) {
            String filterTerm = options.irbOfRecord.toLowerCase()
            results.retainAll {
                issue ->
                    issue.getAllIRBValues()?.any { it?.equalsIgnoreCase(filterTerm)} ||
                            issue.collInst?.equalsIgnoreCase(filterTerm)
            }
        }

        // Apply free text filter
        if (options.freeText) {
            def freeText = options.freeText.toLowerCase()
            Collection<String> projectKeys = results*.projectKey
            Map<String, Collection<Comment>> commentMap = new HashMap<>()
            Map<String, Collection<Event>> eventMap = new HashMap<>()
            if (projectKeys != null && !projectKeys.isEmpty()) {
                commentMap.putAll(Comment.findAllByProjectKeyInList(projectKeys).groupBy {it.projectKey})
                eventMap.putAll(Event.findAllByProjectKeyInList(projectKeys).groupBy {it.projectKey})
            }
            results.retainAll {
                issue ->
                    issue.getAllExtraPropertyValues()*.toLowerCase()?.contains(freeText) ||
                            commentMap.get(issue.projectKey)?.any{it.description?.toLowerCase()?.contains(freeText)} ||
                            eventMap.get(issue.projectKey)?.any{it.summary?.toLowerCase()?.contains(freeText)} ||
                            issue.summary?.toLowerCase()?.contains(freeText) ||
                            issue.description?.toLowerCase()?.contains(freeText) ||
                            issue.projectKey?.toString()?.toLowerCase()?.contains(freeText)
            }
        }

        // Apply BSP collection filter. Has to apply to both projects and consent groups.
        if (options.collection) {
            def collectionLinks = ConsentCollectionLink.findAllByConsentKeyInList(results*.projectKey)
            collectionLinks.retainAll {
                it.sampleCollectionId?.equalsIgnoreCase(options.collection)
            }
            results.retainAll {
                collectionLinks*.consentKey?.contains(it.projectKey)
            }
        }

        // Apply consent filter
        if (options.consent) {
            results.retainAll {
                it.projectKey.equalsIgnoreCase(options.consent)
            }
        }

        // Apply Investigator Name filter
        if (options.investigatorName) {
            results.retainAll {
                issue ->
                    issue.getPIs()?.any{ it?.equalsIgnoreCase(options.investigatorName) }
            }
        }

        // Apply Data Use Restriction filtering
        if (options.dataUseSearch) {

            // Set up a list of Data Use Restrictions that we can further filter the results by
            Collection<DataUseRestriction> restrictions =
                    DataUseRestriction.findAllByConsentGroupKeyInList(results.collect {it.projectKey})

            if (options.generalUse) {
                restrictions.retainAll { it.generalUse }
            }
            else {
                if (options.commercialUseExcluded) restrictions.retainAll { it.commercialUseExcluded }

                /**
                 * Apply disease ontology restrictions.
                 * If the consent group is limited to any diseases, then we need to
                 * further query on whether it matches provided restrictions.
                 * Otherwise, if a consent group does not have general usage restrictions, then
                 * it matches the search criteria regardless of what was entered.
                 */
                if (options.diseaseRestrictions) {
                    // The list of matchable ontology classes include the passed in restriction, plus any ancestors of the
                    // passed in restriction. Ancestors are included because a study with a general restriction, of say
                    // cancer (DOID_162), is suitable for use in a study of heart sarcomas (DOID_5262). Therefore, if the
                    // user searched on DOID_5262, we pull back all ancestors of DOID_5262 which should include DOID_162.
                    Collection<String> matchableClassIDs =
                            ontologyService.
                                    getAncestors(Ontology.DISEASE, options.diseaseRestrictions).
                                    collect { it.id }
                    matchableClassIDs.add(options.diseaseRestrictions)
                    restrictions.retainAll { matchableClassIDs.intersect(it.diseaseRestrictions) }
                }

                /**
                 * Apply a similar function to population. If a sub-population is specified, and a restriction
                 * applies to all members of a parent population, then we have a match.
                 */
                if (options.populationRestrictions) {
                    Collection<String> matchableClassIDs =
                            ontologyService.
                                    getAncestors(Ontology.POPULATION, options.diseaseRestrictions).
                                    collect { it.id }
                    matchableClassIDs.add(options.populationRestrictions)
                    restrictions.retainAll {
                        matchableClassIDs.intersect(it.populationRestrictions)
                    }
                }

                if (options.gender) restrictions.retainAll { it.gender.equalsIgnoreCase(options.gender) }
                if (options.pediatric) restrictions.retainAll { it.pediatricLimited }
                if (options.methodsResearchExcluded) restrictions.retainAll { it.methodsResearchExcluded }

                // TODO: Determine an appropriate mechanism for querying on time based restrictions

            }

            // Apply the Data Use Restriction filter to the consent groups
            results.retainAll { restrictions*.consentGroupKey.contains(it.projectKey) }

        }


        if (options.max && results.size() > options.max - 1) {
            return results.take(options.max - 1)
        }

        results
    }

    Long matchingIssueNamesCount(String issueName) {
        final session = sessionFactory.currentSession
        final String query = 'select count(id) from issue where summary = :issueName'
        SQLQuery sqlQuery = session.createSQLQuery(query)
        sqlQuery.setString('issueName', issueName)
        sqlQuery.uniqueResult() as Long
    }

    PaginatedResponse findIssueByProjectType(String type, PaginationParams pagination) {
        String orderColumn = getIssueOrderColumn(pagination.orderColumn)
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final StringBuffer query = new StringBuffer(' select distinct i.id from issue i left outer join issue_extra_property ie on ie.issue_id = i.id ')
        query.append(' where i.type = :type ' +
                ' and i.deleted = 0 ')
        if (pagination.searchValue) {
            query.append("and (i.project_key LIKE :term ")
                    .append("or i.summary LIKE :term ")
                    .append("or i.status LIKE :term ")
                    .append("or ((ie.name = :initialReviewType ")
                    .append("or ie.name = :reviewCategory ) ")
                    .append("and ie.value LIKE :term ))")
        }
        SQLQuery sqlQuery = session.createSQLQuery(query.toString())
        sqlQuery.setString('type', type)
        if (pagination.searchValue) {
            sqlQuery.setString('term', pagination.getLikeTerm())
            sqlQuery.setString('initialReviewType', IssueExtraProperty.INITIAL_REVIEW_TYPE)
            sqlQuery.setString('reviewCategory', IssueExtraProperty.REVIEW_CATEGORY)
        }
        // total rows
        List<Long> ids = sqlQuery.list()
        List<Issue> results = new ArrayList<>()
        if (CollectionUtils.isNotEmpty(ids)) {
            results = findPaginatedIssuesByIds(ids, orderColumn, pagination)
        }
        new PaginatedResponse(
                draw: pagination.draw,
                recordsTotal: ids.size(),
                recordsFiltered: ids.size(),
                data: results,
                error: ""
        )
    }

    private List<Issue> findPaginatedIssuesByIds(List<Long> ids, String orderColumn, PaginationParams pagination) {
        String query = 'select * from issue where id in :ids '
        if (orderColumn) {
            query = query + " order by " + orderColumn + pagination.sortDirection
        }
        SQLQuery sqlQuery = getSessionFactory().currentSession.createSQLQuery(query)
        List<Issue> results = sqlQuery.with {
            addEntity(Issue)
            setFirstResult(pagination.start)
            setMaxResults(pagination.length)
            setParameterList("ids", ids)
            list()
        }
        results
    }

    private String getIssueOrderColumn(Integer orderColumn) {
        String orderField
        switch (orderColumn) {
            case 0:
                orderField = " project_key "
                break
            case 1:
                orderField = " summary "
                break
            case 2:
                orderField = " status "
                break
        }
        orderField
    }

    Collection<Submission> getSubmissionsByProject(String projectKey) {
        if (!projectKey) return Collections.emptyList()
        final session = sessionFactory.currentSession
        final String query =
                'select * from submission where project_key = :projectKey ORDER BY number DESC'

        final sqlQuery = session.createSQLQuery(query)
        sqlQuery.with {
            setString('projectKey', projectKey)
            addEntity(Submission)
            list()
        }
    }

    Collection<Integer> getSubmissionNumber(String projectKey, String  type, String number) {
        final session = sessionFactory.currentSession
        final String query =
                'select number from submission where project_key = :projectKey and type = :type and number = :number'

        final sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with {
            setString('projectKey', projectKey)
            setString('type', type)
            setString('number', number)
            list()
        }
        results as Collection<Integer>
    }

    /**
     * Collection of Consent group key, Summary string, list of sample collection ids, and whether
     * the consent group has a data use letter or not (useful for knowing the DUR status).
     *
     * @return Collection of maps
     */
    Collection<Map> getConsentGroupInfoWithSamples() {
        final String samplesQuery =
                ' select distinct i.project_key, ccl.sample_collection_id, d.id ' +
                        ' from issue i ' +
                        ' inner join consent_collection_link ccl on ccl.consent_key = i.project_key and ccl.sample_collection_id is not null ' +
                        ' left outer join storage_document d on d.project_key = i.project_key and d.file_type = :file_type and d.deleted = 0 ' +
                        ' where i.type = :type '
        // Temporary lookup map for consent to list of samples in the consent
        Map<String, Collection<String>> consentedSamples = new HashMap()
        // Temporary lookup for consents that have a Data Use letter
        Collection<String> consentsWithDULS = new HashSet<>()
        getSqlConnection().rows(samplesQuery, [type: IssueType.CONSENT_GROUP.name, file_type: ConsentGroupController.DU_LETTER]).each {
            row ->
                def project = row.get("project_key").toString()
                def sample = row.get("sample_collection_id").toString()
                if (!consentedSamples.containsKey(project)) {
                    consentedSamples.put(project, [])
                }
                consentedSamples.get(project).add(sample)
                def dul = row.get("id")
                if (dul != null) { consentsWithDULS.add(project) }
        }

        // Generate the final results from second query, and results of previous lookup
        final String consentQuery = ' select distinct i.project_key, i.summary from issue i where i.type = :type '
        def results = getSqlConnection().rows(consentQuery, [type: IssueType.CONSENT_GROUP.name]).collect {
            row ->
                def project_key = row.get("project_key")
                def summary = row.get("summary")
                [
                        project_key: project_key,
                        summary: summary,
                        sample_collections: consentedSamples.get(project_key),
                        dul: consentsWithDULS.contains(project_key)
                ]
        }
        results
    }

    LinkedHashMap getConsentGroupByKey(String projectKey) {
        Issue issue = findByKey(projectKey)
        List<ConsentCollectionLinkDTO> collectionLinks = getCollectionLinksDtoByConsentKey(projectKey)
        Collection<String> collectionIds = findAllSampleCollectionIdsForConsent(projectKey)
        Collection<SampleCollection> sampleCollections
        if (!collectionIds.isEmpty()) {
            sampleCollections = findCollectionByIdInList(collectionIds)
        } else {
            sampleCollections = Collections.emptyList()
        }
        [
            issue            : issue,
            extraProperties  : new ConsentGroupExtraProperties(issue),
            collectionLinks  : collectionLinks,
            sampleCollections: sampleCollections,
            attachmentsApproved: issue.attachmentsApproved() && consentService.collectionDocumentsApproved(collectionLinks.collect{it.id})
        ]
    }

    /**
     * Find all data use documents for a consent, ordered by most recent first.
     *
     * @param consentKey The consent group's project key
     * @return Ordered list of storage documents of the DUL type.
     */
    List<StorageDocument> getDataUseLettersForConsent(String consentKey) {
        final String query =
                ' select d.* ' +
                ' from storage_document d ' +
                ' where d.project_key = :projectKey ' +
                ' and d.file_type = :fileType ' +
                ' and d.deleted = 0 '+
                ' order by d.creation_date desc '
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with {
            addEntity(StorageDocument)
            setString('projectKey', consentKey)
            setString('fileType', ConsentGroupController.DU_LETTER)
            list()
        }
        results
    }

    Collection<StorageDocument> getAttachmentsForProject(String projectKey) {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query =
                ' select d.* ' +
                ' from storage_document d ' +
                ' where d.id not in (select distinct storage_document_id from submission_document) ' +
                ' and d.project_key = :projectKey' +
                ' and d.deleted = 0 ' +
                ' order by d.creation_date desc '
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with {
            addEntity(StorageDocument)
            setString('projectKey', projectKey)
            list()
        }
        results
    }

    Collection<StorageDocument> getDocumentsForProject(String projectKey) {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query =
                ' select distinct d.* ' +
                ' from storage_document d ' +
                ' where d.project_key = :projectKey' +
                ' and d.deleted = 0 '
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with {
            addEntity(StorageDocument)
            setString('projectKey', projectKey)
            list()
        }
        results
    }

    Collection<StorageDocument> getAttachmentsForProjects(Collection<String> projectKeys) {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query =
                ' select d.* ' +
                ' from storage_document d ' +
                ' where d.id not in (select distinct submission_document_id from submission_document) ' +
                ' and d.project_key in :projectKeys ' +
                ' and d.deleted = 0 ' +
                ' order by d.creation_date desc '
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with {
            addEntity(StorageDocument)
            setParameterList('projectKeys', projectKeys)
            list()
        }
        results
    }

    @SuppressWarnings("GroovyAssignabilityCheck")
    StorageDocument findAttachmentByUuid(String uuid) {
        final session = sessionFactory.currentSession
        final String query = ' select * from storage_document where uuid = :uuid and deleted = 0'
        final sqlQuery = session.createSQLQuery(query)
        sqlQuery.with {
            addEntity(StorageDocument)
            setParameter("uuid", uuid)
            uniqueResult()
        }
    }

    @SuppressWarnings("GroovyAssignabilityCheck")
    Map<String, String> getIssueKeysWithType() {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = ' select distinct i.project_key, i.type from issue i '
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with { list() }.
                collectEntries { row -> [row[0], row[1]] }
        results
    }

    Collection<Event> getEventsForProject(String projectKey) {
        if (StringUtils.isEmpty(projectKey)) {
            Collections.emptyList()
        }
        else {
            SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
            final session = sessionFactory.currentSession
            final String query =
                    ' select * ' +
                            ' from event ' +
                            ' where project_key = ?' +
                            ' order by created desc '
            final SQLQuery sqlQuery = session.createSQLQuery(query)
            sqlQuery.setString(0, projectKey)
            final events = sqlQuery.with {
                addEntity(Event)
                list()
            }
            events
        }
    }

    Collection<Funding> findFundingsByProject(String projectKey) {
        projectKey ? Funding.findAllByProjectKey(projectKey) : Collections.emptyList()
    }

    Map<String, Boolean> isCollaboratorInRelatedProjects(Collection<String> consentKeyList, String userName) {
        if (CollectionUtils.isEmpty(consentKeyList)) return new HashMap<String, List<Issue>>()
        StringBuffer query = new StringBuffer(
                'select consent_key, project_key from consent_collection_link where ')
        consentKeyList.eachWithIndex { it, index ->
            query.append(index == 0 ? 'consent_key = + \'' + it + '\'' : ' OR consent_key = \'' + it + '\'')
        }
        Map<String, List<String>> associatedProjects = new HashMap<>()
        getSqlConnection().rows(query.toString()).forEach({
            if (associatedProjects.containsKey(it.get("consent_key"))) {
                List<String> projectKeys = associatedProjects.get(it.get("consent_key"))
                projectKeys.add(it.get("project_key")?.toString())
                associatedProjects.put(it.get("consent_key")?.toString(), projectKeys)
            } else {
                associatedProjects.put(it.get("consent_key")?.toString(), new ArrayList<String>(Arrays.asList(it.get("project_key").toString())))
            }
        })
        Map<String, Boolean> projectsCollaborator = new HashMap<>()
        associatedProjects?.each {
            projectsCollaborator.put(it.key, isUserCollaborator(it.value, userName))
        }
        projectsCollaborator
    }

    private Boolean isUserCollaborator(List<String> projectsKey, String userName) {
        final session = sessionFactory.currentSession
        final String query = ' select * from issue_extra_property where ' +
                ' name = :name and ' +
                ' project_key in :projectsKey and' +
                ' value = :userName'
        final sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with {
            setParameterList('projectsKey', projectsKey)
            setParameter('name', IssueExtraProperty.COLLABORATOR)
            setParameter('userName', userName)
            list()
        }
        results?.size() > 0
    }

    private static generateILikeTerm(String term) {
        ("%" + term.replaceAll(";", "") + "%").toLowerCase()
    }

    private static String getIssueNumberFromString(String key) {
        try {
            key.replaceAll(";", "")
            key.find(/\d+/).toInteger()
        } catch (Exception e) {
            log.warn("Unable to findIssues issue by key [" + key + "]: " + e)
            ""
        }
    }

    /**
     * Get last version for the specified project key and file type
     * @return List of distinct disease terms
     */
    Long findNextVersionByFileTypeAndProjectKey(String projectKey, String fileType) {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query =
                ' select COALESCE(MAX(d.doc_version), 0) ' +
                        ' from storage_document d ' +
                        ' where d.project_key = ? ' +
                        ' and d.file_type = ? ' +
                        ' and d.deleted = 0 '
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        sqlQuery.setString(0, projectKey)
        sqlQuery.setString(1, fileType)
        String version = (String)sqlQuery.list()?.get(0)
        ++Long.valueOf(version)
    }

    Collection<List> getDocumentsVersions() {
        List<HashMap<String, String>> storageDocumentList = new ArrayList<>()
        final String singleVersionDocQuery =
                'select project_key, file_type, count(file_type) as counted ' +
                        'from storage_document where doc_version = 0 and deleted = 0 ' +
                        'group by project_key, file_type  ' +
                        'order by project_key, file_type'
        getSqlConnection().rows(singleVersionDocQuery).each {
            HashMap<String, String> documentMap = new HashMap<>()
            documentMap.put('projectKey', it.get("project_key").toString())
            documentMap.put('fileType', it.get("file_type").toString())
            documentMap.put('counted', it.get("counted").toString())
            storageDocumentList.push(documentMap)
        }

        storageDocumentList
    }

    StorageDocument getDocument(String projectKey, String fileType) {
        getDocuments(projectKey, fileType).first()
    }

    Collection<StorageDocument> getDocuments(String projectKey, String fileType) {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query =
                ' select d.* ' +
                        ' from storage_document as d ' +
                        ' where d.project_key = ?' +
                        ' and d.file_type = ?' +
                        ' and d.deleted = 0 '
                        ' order by creation_date'
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        sqlQuery.setString(0, projectKey)
        sqlQuery.setString(1, fileType)
        final documents = sqlQuery.with {
            addEntity(StorageDocument)
            list()
        }

        documents
    }

     void updateOrspUserRoles (User user, ArrayList<String> newRoles) {
         final session = sessionFactory.currentSession
         final String query = ' insert into supplemental_role (version, role, user, user_id) values (:version, :role, :userName, :userId)'
         final SQLQuery sqlQuery = session.createSQLQuery(query)
         newRoles.each { it ->
             sqlQuery.setLong("version", 0)
             sqlQuery.setString("role", it)
             sqlQuery.setString("userName", user.userName)
             sqlQuery.setLong("userId", user.id)
             sqlQuery.executeUpdate()
         }
    }

    void deleteOrspUserRoles (userId) {
        final session = sessionFactory.currentSession
        final String query = 'delete from supplemental_role where user_id = :userId'
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        sqlQuery.setParameter("userId", userId)
        sqlQuery.executeUpdate()
    }

    List<User> findUsersInUserNameList(List<String> usersList) {
        List<User> results = Collections.emptyList()
        if (CollectionUtils.isNotEmpty(usersList)) {
            final session = sessionFactory.currentSession
            final String query = ' select * from user where user_name in :usersList '
            final sqlQuery = session.createSQLQuery(query)

            try {
                results = sqlQuery.with {
                    addEntity(User)
                    setParameterList('usersList', usersList)
                    list()
                }
            } catch(Exception e) {
                log.error("There is more than one matching result when trying to get comments for IssueId:.", e)
            }
        }
        results
    }

    @SuppressWarnings(["GrUnresolvedAccess", "GroovyAssignabilityCheck"])
    PaginatedResponse queryUserRoles(PaginationParams pagination) {
        Integer count = User.count()
        String orderField
        switch (pagination.orderColumn) {
            case 0:
                orderField = "userName"
                break
            case 1:
                orderField = "displayName"
                break
            case 2:
                orderField = "emailAddress"
                break
            case 3:
                orderField = "roles"
                break
            default:
                orderField = "userName"
                break
        }

        PagedResultList<User> usersResult = User.
                createCriteria().
                list(max: pagination.length, offset: pagination.start) {
                    maxResults pagination.length
                    firstResult pagination.start
                    order(orderField, pagination.sortDirection)
                    if (pagination.searchValue) {
                        or {
                            ilike("userName", pagination.getLikeTerm())
                            ilike("displayName", pagination.getLikeTerm())
                            ilike("emailAddress", pagination.getLikeTerm())
                        }
                    }
                }

        List<User> users = usersResult.toList()

        new PaginatedResponse(
                draw: pagination.draw,
                recordsTotal: count,
                recordsFiltered: usersResult.getTotalCount(),
                data: users,
                error: ""
        )

    }
    /**
     * @param issueId
     * @return A collection of Comments for a given IssueId if an error occurs it is logged and an empty list is returned.
     */
    Collection<Comment> getCommentsByIssueId(String issueId) {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query =
                ' select * from comment where project_key = :issueId order by created desc'
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        Collection<Comment> results = Collections.emptyList()
        try {
            results = sqlQuery.with {
                addEntity(Comment)
                setString('issueId', issueId)
                list()
            }
        } catch(NonUniqueResultException e) {
            log.error("There is more than one matching result when trying to get comments for IssueId: ${issueId}.", e)
        } catch(MappingException e) {
            log.error("The given entity name could not be resolved, when trying to get comments for issueId: ${issueId}.", e)
        } catch(HibernateException e) {
            log.error("An error has occurred when trying to get comments for issueId: ${issueId}.", e)
        }
        results
    }


    PaginatedResponse findDataUseRestrictions(PaginationParams pagination) {
        // get total rows
        String query = 'select count(du.id) from data_use_restriction du inner join issue i on i.project_key = du.consent_group_key ' + getDURWhereClause(pagination)
        String orderColumn = getRestrictionOrderColumn(pagination.orderColumn)
        SQLQuery sqlQuery = getSessionFactory().currentSession.createSQLQuery(query)
        if (pagination.searchValue) sqlQuery.setString('term', pagination.getLikeTerm())
        Long totalRows = sqlQuery.uniqueResult()

        // get DUR paginated
        String durQuery =  'select * from data_use_restriction du inner join issue i on i.project_key = du.consent_group_key ' + getDURWhereClause(pagination) + " order by " + orderColumn + pagination.sortDirection
        SQLQuery sqlDURQuery = getSessionFactory().currentSession.createSQLQuery(durQuery)

        List<DataUseRestriction> results = sqlDURQuery.with {
            if (pagination.searchValue) setString('term', pagination.getLikeTerm())
            addEntity(DataUseRestriction)
            setFirstResult(pagination.start)
            setMaxResults(pagination.length)
            list()
        }
        new PaginatedResponse(
                draw: pagination.draw,
                recordsTotal: totalRows,
                recordsFiltered: totalRows,
                data: results,
                error: ""
        )
    }

    private String getDURWhereClause(PaginationParams pagination) {
        String where
        if (pagination.searchValue) {
            where = ' where (du.consent_group_key LIKE :term OR du.vault_export_date LIKE :term) and i.deleted = 0 '
        } else {
            where = ' where i.deleted = 0 '
        }
        where
    }

    List<ConsentCollectionLink> findCollectionLinks() {
        String query = 'select * from consent_collection_link where deleted = 0 '
        SQLQuery sqlQuery = getSessionFactory().currentSession.createSQLQuery(query)
        List<ConsentCollectionLink> links = sqlQuery.with {
            addEntity(ConsentCollectionLink)
            list()
        }
        Map<String, SampleCollection> collectionMap = getCollectionIdMap(links)
        (links as Collection<ConsentCollectionLink>).each { link ->
            if (link) {
                if (link?.sampleCollectionId && collectionMap.containsKey(link?.sampleCollectionId)) {
                    link.setSampleCollection(collectionMap.get(link.sampleCollectionId))
                }
            }
        }
        links
    }

    PaginatedResponse findAllCollectionLinks(PaginationParams pagination) {
        // get total rows
        String totalRowsQuery =
                ' select count(ccl.id) from consent_collection_link ccl ' +
                ' left join issue project on project.project_key = ccl.project_key ' +
                ' left join issue c on c.project_key = ccl.consent_key ' +
                ' where ccl.deleted = 0 ' +
                ' and project.deleted = 0 ' +
                ' and c.deleted = 0 ' + getCollectionLinksWhereClause(pagination)
        SQLQuery query = getSessionFactory().currentSession.createSQLQuery(totalRowsQuery)
        if (pagination.searchValue) query.setString('term', pagination.getLikeTerm())
        Long totalRows = query.uniqueResult()

        String queryCCL = 'select ccl.* from consent_collection_link ccl ' +
                ' left join issue project on project.project_key = ccl.project_key left join issue c on c.project_key = ccl.consent_key ' +
                ' where ccl.deleted = 0 and project.deleted = 0 and c.deleted = 0 ' + getCollectionLinksWhereClause(pagination)
        String orderColumn = getSampleCollectionOrderColumn(pagination.orderColumn)
        queryCCL = queryCCL + ' order by ' + orderColumn + pagination.sortDirection
        SQLQuery sqlQuery = getSessionFactory().currentSession.createSQLQuery(queryCCL)
        List<ConsentCollectionLink> links = sqlQuery.with {
            if (pagination.searchValue) sqlQuery.setString('term', pagination.getLikeTerm())
            addEntity(ConsentCollectionLink)
            setFirstResult(pagination.start)
            setMaxResults(pagination.length)
            list()
        }
        new PaginatedResponse(
                draw: pagination.draw,
                recordsTotal: totalRows,
                recordsFiltered: totalRows,
                data: links,
                error: ""
        )
    }

    List<DataUseRestriction> findDataUseRestrictionByConsentGroupKeyInList(List<String> consentGroupKeys) {
        String query = 'select du.* from data_use_restriction du inner join issue i on i.project_key = du.consent_group_key where consent_group_key IN :consentGroupKeys and i.deleted = 0'
        SQLQuery sqlQuery = getSessionFactory().currentSession.createSQLQuery(query)
        sqlQuery.with {
            addEntity(DataUseRestriction)
            setParameterList('consentGroupKeys', consentGroupKeys)
            list()
        }
    }

    private String getRestrictionOrderColumn(Integer orderColumn) {
        String orderField
        switch (orderColumn) {
            case 0:
                orderField = " consent_group_key "
                break
            case 1:
                orderField = " vault_export_date "
                break
        }
        orderField
    }

    private String getCollectionOrderColumn(Integer orderColumn) {
        String orderField
        switch (orderColumn) {
            case 0:
                orderField = " consent_group_key "
                break
            case 1:
                orderField = " vault_export_date "
                break
        }
        orderField
    }

    private String getSampleCollectionOrderColumn(Integer orderColumn) {
        String orderField
        switch (orderColumn) {
            case 1:
                orderField = " consent_key "
                break
            case 2:
                orderField = " sample_collection_id "
                break
            case 3:
                orderField = " status "
                break
            default:
                orderField = "project_key "
                break
        }
        orderField
    }

    private String getCollectionLinksWhereClause(pagination) {
        String query = ''
        if (pagination.searchValue) {
            query = ' and (ccl.consent_key LIKE :term OR ccl.project_key LIKE :term OR ccl.status LIKE :term OR ccl.sample_collection_id LIKE :term )'
        }
        query
    }

}
