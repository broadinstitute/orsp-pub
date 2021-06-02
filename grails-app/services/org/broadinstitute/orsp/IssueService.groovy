package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import grails.web.servlet.mvc.GrailsParameterMap
import groovy.util.logging.Slf4j
import org.apache.commons.lang.BooleanUtils
import org.apache.commons.lang.StringUtils

/**
 * This class handles the general update or creation of issues and nothing more.
 *
 * Transactional is applied only to certain methods which means that default != true for methods not marked as such.
 *
 */
@SuppressWarnings("GrMethodMayBeStatic")
@Slf4j
class IssueService implements UserInfo {

    QueryService queryService
    PersistenceService persistenceService
    NotifyService notifyService
    IssueReviewService issueReviewService
    StorageProviderService storageProviderService
    OrganizationService organizationService

    Collection<String> singleValuedPropertyKeys = [
            IssueExtraProperty.ACCURATE,
            IssueExtraProperty.AFFILIATION_OTHER,
            IssueExtraProperty.AWARD_NIH_HHS,
            IssueExtraProperty.CODED_NOT_IDENTIFIABLE,
            IssueExtraProperty.CODES,
            IssueExtraProperty.COLL_INST,
            IssueExtraProperty.COLL_CONTACT,
            IssueExtraProperty.COLL_HAS_IDENTITY,
            IssueExtraProperty.COLL_PUBLICATION,
            IssueExtraProperty.COMMERCIALLY_AVAILABLE,
            IssueExtraProperty.CONSENT,
            IssueExtraProperty.DATA_SHARING_BROAD,
            IssueExtraProperty.DATA_SHARING_COMMENTS,
            IssueExtraProperty.DATA_SHARING_NIH,
            IssueExtraProperty.DBGAP,
            IssueExtraProperty.DECEASED,
            IssueExtraProperty.FEE_FOR_SERVICE,
            IssueExtraProperty.FEE_FOR_SERVICE_WORK,
            IssueExtraProperty.IDENTIFIABLE,
            IssueExtraProperty.INTERACT,
            IssueExtraProperty.IRB,
            IssueExtraProperty.PROTOCOL,
            IssueExtraProperty.NOT_HSR,
            IssueExtraProperty.RATIONALE,
            IssueExtraProperty.RESEARCH,
            IssueExtraProperty.RESPONSIBLE,
            IssueExtraProperty.REVIEW_CATEGORY,
            IssueExtraProperty.SOURCE,
            IssueExtraProperty.SUBMISSION_TYPE,
            IssueExtraProperty.PROJECT_TITLE,
            IssueExtraProperty.SUBJECT_PROTECTION,
            IssueExtraProperty.PI,
            IssueExtraProperty.PM,
            IssueExtraProperty.PROJECT_REVIEW_APPROVED,
            IssueExtraProperty.APPROVAL,
            IssueExtraProperty.SUBJECT_PROTECTION,
            IssueExtraProperty.PROJECT_AVAILABILITY,
            IssueExtraProperty.EDIT_DESCRIPTION,
            IssueExtraProperty.DESCRIBE_EDIT_TYPE,
            IssueExtraProperty.INSTITUTIONAL_SOURCES,
            IssueExtraProperty.UPLOAD_CONSENT_GROUP,
            IssueExtraProperty.NOT_UPLOAD_CONSENT_GROUP_SPECIFY,
            IssueExtraProperty.IRB_REFERRAL,
            IssueExtraProperty.IRB_REFERRAL_TEXT,
            IssueExtraProperty.INVESTIGATOR_FIRST_NAME,
            IssueExtraProperty.INVESTIGATOR_LAST_NAME,
            IssueExtraProperty.INITIAL_DATE,
            IssueExtraProperty.INITIAL_REVIEW_TYPE,
            IssueExtraProperty.IRB_EXPIRATION_DATE,
            IssueExtraProperty.BIO_MEDICAL,
            IssueExtraProperty.PROJECT_STATUS,
            IssueExtraProperty.ASSIGNED_ADMIN,
            IssueExtraProperty.CATEGORY_FOUR,
            IssueExtraProperty.CATEGORY_FOUR_I,
            IssueExtraProperty.CATEGORY_FOUR_II,
            IssueExtraProperty.CATEGORY_FOUR_III,
            IssueExtraProperty.CATEGORY_FOUR_IV,
            IssueExtraProperty.CATEGORY_TWO,
            IssueExtraProperty.CATEGORY_TWO_I,
            IssueExtraProperty.CATEGORY_TWO_II,
            IssueExtraProperty.CATEGORY_TWO_III,
            IssueExtraProperty.NOT_ENGAGED_CATEGORY,
            IssueExtraProperty.TEXT_OTHER_NOT_ENGAGED_CATEGORY,
            IssueExtraProperty.TEXT_OTHER_CATEGORY,
            IssueExtraProperty.OTHER_CATEGORY,
            IssueExtraProperty.FEE_FOR_SERVICE,
            IssueExtraProperty.BROAD_INVESTIGATOR,
            IssueExtraProperty.SUBJECTS_DECEASED,
            IssueExtraProperty.INTERACTION_SOURCE,
            IssueExtraProperty.SENSITIVE_INFORMATION_SOURCE,
            IssueExtraProperty.IS_ID_RECEIVE,
            IssueExtraProperty.IRB_REVIEWED_PROTOCOL,
            IssueExtraProperty.HUMAN_SUBJECTS,
            IssueExtraProperty.ADMIN_COMMENTS
    ]


    Collection<String> multiValuedPropertyKeys = [
            IssueExtraProperty.PROJECT_QUESTIONNAIRE,
            IssueExtraProperty.ACTOR,
            IssueExtraProperty.AFFILIATIONS,
            IssueExtraProperty.NOT_RESEARCH,
            IssueExtraProperty.COLLABORATOR,
            IssueExtraProperty.PM,
            IssueExtraProperty.PI,
            IssueExtraProperty.SAMPLES,
            IssueExtraProperty.DEGREE,
            IssueExtraProperty.NO_CONSENT_FORM_REASON,
    ]

    /**
     * Persist a new, unsaved issue
     *
     * @param issue The new issue
     * @return Persisted issue
     */
    @Transactional
    @Deprecated
    Issue addIssue(Issue issue, GrailsParameterMap input) throws DomainException {
        IssueType type = IssueType.valueOfName(issue.type)
        issue.setProjectKey(QueryService.PROJECT_KEY_PREFIX + type.prefix + "-")
        if (issue.hasErrors()) {
            throw new DomainException(issue.getErrors())
        } else {
            issue.save(flush: true)
        }
        issue.setProjectKey(issue.projectKey + issue.id)
        updateIssue(issue, input)
    }

    /**
     * Handles the update to an existing issue.
     *
     * @param issue The existing issue to update.
     * @param input Map of form arguments that come from any of the various update forms
     * @return Persisted issue
     */
    @Transactional
    Issue updateIssue(Issue issue, Map<String, Object> input) throws DomainException {
        // Top level properties that are set on the Issue object.
        if (!(issue.getType() == IssueType.CONSENT_GROUP.getName()) && input.get(IssueExtraProperty.SUMMARY)) {
            issue.setSummary((String) input.get(IssueExtraProperty.SUMMARY))
        } else if (issue.getType().equals(IssueType.CONSENT_GROUP.getName())) {
            issue.setSummary((String) input.get(IssueExtraProperty.CONSENT) + " / " + input.get(IssueExtraProperty.PROTOCOL ))
        }
        if (input.get(IssueExtraProperty.DESCRIPTION)) {
            issue.setDescription((String) input.get(IssueExtraProperty.DESCRIPTION))
        }
        if (input.get("expirationDate")) {
            issue.setExpirationDate(Date.parse('MM/dd/yyyy', input.get("expirationDate").toString()))
        } else {
            issue.setExpirationDate(null)
        }

        // Handle native associations.

        // Funding:
        def fundingParams = input.get('fundings')

        def newFundingList = fundingParams.collect { p ->
            Long fundingID = Long.valueOf(p.getOrDefault("id", "0").toString())
            Funding f = (fundingID > 0) ? Funding.findById(fundingID) : new Funding()
            if (!f.getCreated()) f.setCreated(new Date())
            if (f.id) f.setUpdated(new Date())
            f.setSource(p.get("source").toString())
            f.setName(p.get("name").toString())
            f.setAwardNumber(p.get("award").toString())
            f.setProjectKey(issue.projectKey)
            f
        }
        newFundingList.each {
            issue.addToFundings(it)
            it.save()
        }
        def newFundingIdList = newFundingList*.id
        def oldFundingList = queryService.findFundingsByProject(issue.projectKey)

        // Remove the existing ones missing from the list of updated/new fundings:
        def deletableFundings = oldFundingList.findAll { !newFundingIdList.contains(it.id) }
        deletableFundings.each {
            issue.removeFromFundings(it)
            it.delete(hard: true)
        }
        
        // Remaining properties are IssueExtraProperty associations
        Collection<IssueExtraProperty> propsToDelete = findPropsForDeleting(issue, input)
        Collection<IssueExtraProperty> propsToSave = getSingleValuedPropsForSaving(issue, input)
        propsToSave.addAll(getMultiValuedPropsForSaving(issue, input))

        // handle checkbox cases. If there is no parameter map entry for checkboxes, we need to set the param to null.
        if (!input.containsKey(IssueExtraProperty.NOT_RESEARCH)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.NOT_RESEARCH })
        }
        if (!input.containsKey(IssueExtraProperty.NOT_HSR)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.NOT_HSR })
        }
        if (!input.containsKey(IssueExtraProperty.FEE_FOR_SERVICE)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.FEE_FOR_SERVICE})
        }
        if (!input.containsKey(IssueExtraProperty.FEE_FOR_SERVICE_WORK)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.FEE_FOR_SERVICE_WORK})
        }
        if (!input.containsKey(IssueExtraProperty.SAMPLES)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.SAMPLES})
        }
        if (!input.containsKey(IssueExtraProperty.PI)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.PI})
        }
        if (!input.containsKey(IssueExtraProperty.DESCRIBE_EDIT_TYPE)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.DESCRIBE_EDIT_TYPE})
        }
        if (!input.containsKey(IssueExtraProperty.PM)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.PM})
        }
        if (!input.containsKey(IssueExtraProperty.COLLABORATOR)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.COLLABORATOR})
        }
        if (input.get(IssueExtraProperty.COLL_CONTACT) == "") {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.COLL_CONTACT })
        }
        if (!input.containsKey(IssueExtraProperty.NOT_UPLOAD_CONSENT_GROUP_SPECIFY)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.NOT_UPLOAD_CONSENT_GROUP_SPECIFY})
        }
        if (!input.containsKey(IssueExtraProperty.IRB_REFERRAL)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.IRB_REFERRAL})
        }
        if (!input.containsKey(IssueExtraProperty.AFFILIATIONS)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.AFFILIATIONS})
        }
        if (input.containsKey(IssueExtraProperty.AFFILIATION_OTHER)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.AFFILIATION_OTHER})
        }
        if (input.containsKey(IssueExtraProperty.PROJECT_STATUS) && StringUtils.isNotEmpty(input.get(IssueExtraProperty.PROJECT_STATUS))) {
            issue.setApprovalStatus(input.get(IssueExtraProperty.PROJECT_STATUS))
        }
        if (input.containsKey(IssueExtraProperty.NO_CONSENT_FORM_REASON) && StringUtils.isNotEmpty(input.get(IssueExtraProperty.NO_CONSENT_FORM_REASON))) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.NO_CONSENT_FORM_REASON})
        }

        // handle determination questions update
        if (input.containsKey(IssueExtraProperty.BROAD_INVESTIGATOR) && input.get(IssueExtraProperty.BROAD_INVESTIGATOR) == "") {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.BROAD_INVESTIGATOR })
        }
        if (input.containsKey(IssueExtraProperty.SUBJECTS_DECEASED) && input.get(IssueExtraProperty.SUBJECTS_DECEASED) == "") {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.SUBJECTS_DECEASED })
        }
        if (input.containsKey(IssueExtraProperty.SENSITIVE_INFORMATION_SOURCE) && input.get(IssueExtraProperty.SENSITIVE_INFORMATION_SOURCE) == "") {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.SENSITIVE_INFORMATION_SOURCE })
        }
        if (input.containsKey(IssueExtraProperty.INTERACTION_SOURCE) && input.get(IssueExtraProperty.INTERACTION_SOURCE) == "") {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.INTERACTION_SOURCE })
        }
        if (input.containsKey(IssueExtraProperty.IS_ID_RECEIVE) && input.get(IssueExtraProperty.IS_ID_RECEIVE) == "") {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.IS_ID_RECEIVE })
        }
        if (input.containsKey(IssueExtraProperty.IS_CO_PUBLISHING) && input.get(IssueExtraProperty.IS_CO_PUBLISHING) == "") {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.IS_CO_PUBLISHING })
        }
        if (input.containsKey(IssueExtraProperty.IRB_REVIEWED_PROTOCOL) && input.get(IssueExtraProperty.IRB_REVIEWED_PROTOCOL) == "") {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.IRB_REVIEWED_PROTOCOL })
        }
        if (input.containsKey(IssueExtraProperty.HUMAN_SUBJECTS) && input.get(IssueExtraProperty.HUMAN_SUBJECTS) == "") {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.HUMAN_SUBJECTS })
        }

        propsToDelete.each {
            issue.removeFromExtraProperties(it)
            it.delete(hard: true)
        }

        propsToSave.each {
            it.save()
        }

        issue.setUpdateDate(new Date())

        if (issue.hasErrors()) {
            throw new DomainException(issue.getErrors())
        } else {
            issue.save(flush: true)
        }
        if (input.get("editsApproved")) {
            notifyService.sendEditsApprovedNotification(issue, issueReviewService.findByProjectKey(issue.projectKey)?.getEditCreatorName(), getUser()?.displayName)
            persistenceService.saveEvent(issue.projectKey, getUser()?.displayName, "Edits Approved", EventType.APPROVE_EDITS)
        }
        issue
    }

    /**
     * Handles the update of project key to an existing issue.
     *
     * @param issue The existing issue to update.
     * @param input Map of form arguments that come from any of the various update forms
     * @return Persisted issue
     */
    @Transactional
    Issue updateProjectkey(Issue issue, Map<String, Object> input) throws DomainException {
        // update projectKey and type if response to determination questions changed
            IssueType issueType = IssueType.valueOfPrefix(input.get("type"))
            if (issue.getType() != issueType.getName()) {
                String oldProjectKey = issue.projectKey
                String newProjectKey = QueryService.PROJECT_KEY_PREFIX + issueType.prefix + "-" + issue.id

                IssueReview issueReview = issueReviewService.findByProjectKey(oldProjectKey)
                String editCreatorName = issueReview.editCreatorName
                issueReview.delete(flush: true)

                Collection<IssueExtraProperty> extraProperties = issue.getExtraProperties()
                extraProperties?.each {
                    it.setProjectKey(newProjectKey)
                    it.save(flush: true)
                }

                // update Funding projectKey
                List<Funding> fundingList = queryService.findFundingsByProject(oldProjectKey)
                fundingList?.each {
                    it.setProjectKey(newProjectKey)
                    it.save(flush: true)
                }

                // update Issue projectKey
                issue.setType(issueType.getName())
                issue.setProjectKey(newProjectKey)
                if (issue.hasErrors()) {
                    throw new DomainException(issue.getErrors())
                } else {
                    issue.save(flush: true)
                }

                // update Event projectKey
                List<Event> events = queryService.getEventsForProject(oldProjectKey)
                events?.each {
                    it.setProjectKey(newProjectKey)
                    it.save(flush: true)
                }

                // update ConsentCollectionLink projectKey
                List<ConsentCollectionLink> consents = queryService.findCollectionLinksByProjectKey(oldProjectKey)
                consents?.each {
                    it.setProjectKey(newProjectKey)
                    it.save(flush: true)
                }

                // update Comment projectKey
                List<Comment> comments = queryService.getCommentsByIssueId(oldProjectKey)
                comments?.each {
                    it.setProjectKey(newProjectKey)
                    it.save(flush: true)
                }

                // update Submission projectKey
                List<Submission> submissions = queryService.getSubmissionsByProject(oldProjectKey)
                submissions?.each {
                    it.setProjectKey(newProjectKey)
                    it.save(flush: true)
                }

                // update StorageDocument projectKey
                List<StorageDocument> documents = queryService.getDocumentsForProject(oldProjectKey)
                documents?.each {
                    storageProviderService.renameStorageDocument(it, newProjectKey)
                    it.setProjectKey(newProjectKey)
                    it.save(flush: true)
                }

                notifyService.sendDeterminationRevisedNotification(issue, editCreatorName, oldProjectKey)
                persistenceService.saveEvent(issue.projectKey, getUser()?.displayName, "Determination revised", EventType.APPROVE_EDITS)
            }
        issue
    }

    @SuppressWarnings(["GroovyAssignabilityCheck"])
    @Transactional
    Issue updateAdminOnlyProperties(Map<String, Object> input) throws DomainException {
        Issue issue = Issue.findByProjectKey(params.projectKey)
        String previousStatus = issue.getApprovalStatus()
        Collection<IssueExtraProperty> propsToDelete = findPropsForDeleting(issue, input)
        Collection<IssueExtraProperty> propsToSave = getSingleValuedPropsForSaving(issue, input)
        propsToSave.addAll(getMultiValuedPropsForSaving(issue, input))
        if (!input.containsKey(IssueExtraProperty.DEGREE)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.DEGREE})
        }
        if (!input.containsKey(IssueExtraProperty.INITIAL_DATE)) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.INITIAL_DATE})
        }
        if (input.containsKey(IssueExtraProperty.IRB_EXPIRATION_DATE)) {
            issue.setExpirationDate(
                    new Date(input.get(IssueExtraProperty.IRB_EXPIRATION_DATE))
            )
        }
        if (input.containsKey(IssueExtraProperty.PROJECT_STATUS) && StringUtils.isNotEmpty(input.get(IssueExtraProperty.PROJECT_STATUS)) && !previousStatus.equals(input.get(IssueExtraProperty.PROJECT_STATUS))) {
            propsToDelete.addAll(issue.getExtraProperties().findAll { it.name == IssueExtraProperty.ACTOR})
            issue.setApprovalStatus(input.get(IssueExtraProperty.PROJECT_STATUS))
        }

        propsToDelete.each {
            issue.removeFromExtraProperties(it)
            it.delete(hard: true, flush: true)
        }

        propsToSave.each {
            it.save(flush: true)
        }

        issue.setUpdateDate(new Date())
        if (issue.hasErrors()) {
            throw new DomainException(issue.getErrors())
        } else {
            issue.save(flush: true)
        }
        if (shouldUpdateStatus(input.get(IssueExtraProperty.PROJECT_STATUS), previousStatus)) {
            persistenceService.saveEvent(issue.projectKey, getUser()?.displayName, "Project " + input.get(IssueExtraProperty.PROJECT_STATUS), eventTypeMatcher(input.get(IssueExtraProperty.PROJECT_STATUS)))
        }
        String newStatus = Optional.ofNullable(input.get(IssueExtraProperty.PROJECT_STATUS)).orElse("")

        if (!previousStatus?.equals(newStatus)) {
            notifyService.sendProjectStatusNotification((String)input.get(IssueExtraProperty.PROJECT_STATUS), issue, getUser()?.displayName)
        }
        issue
    }

    Boolean shouldUpdateStatus(String status, String previousStatus) {
        Boolean isAValidStatus = Arrays.stream(IssueStatus.values()).anyMatch{t -> t.name().equals(status)}
        Boolean statusHasChanged = !status.equals(previousStatus)
        isAValidStatus && statusHasChanged
    }

    EventType eventTypeMatcher(String status) {
        EventType type

        switch(status) {
            case IssueStatus.Closed.getName():
                type = EventType.CLOSED
                break

            case IssueStatus.Abandoned.getName():
                type = EventType.ABANDON_PROJECT
                break

            case IssueStatus.Approved.getName():
                type = EventType.APPROVE_PROJECT
                break

            case IssueStatus.Disapproved.getName():
                type = EventType.DISAPPROVE_PROJECT
                break

            case IssueStatus.Withdrawn.getName():
                type = EventType.WITHDRAWN_PROJECT
                break

            default:
                type = EventType.CHANGE
                break
        }
        type
    }

    Issue createIssue(IssueType type, Issue issue) throws DomainException {
        issue.setProjectKey(QueryService.PROJECT_KEY_PREFIX + type.prefix + "-")
        List<IssueExtraProperty> extraProperties = issue.getNonEmptyExtraProperties()
        Collection<Funding> fundings = issue.getFundings()
        Issue newIssue = initIssue(issue, type)
        if (newIssue.hasErrors()) {
            throw new DomainException(newIssue.getErrors())
        } else {
            newIssue.save(flush: true)
        }
        newIssue.setProjectKey(newIssue.projectKey + newIssue.id)
        newIssue.save(flush: true)
        saveExtraProperties(newIssue, extraProperties)
        saveFundings(newIssue, fundings)
        newIssue.save(flush: true)
        newIssue.extraProperties = extraProperties
        newIssue
    }

    void saveExtraProperties(Issue issue, List<IssueExtraProperty> extraProperties) {
        extraProperties?.each {
            it.issue = issue
            it.projectKey = issue.projectKey
            it.save(flush: true)
        }
    }

    @SuppressWarnings(["GroovyAssignabilityCheck"])
    Issue modifyExtraProperties(Object input, String projectKey) {
        Issue issue = queryService.findByKey(projectKey)
        Collection<IssueExtraProperty> extraPropertiesList = getSingleValuedPropsForSaving(issue, input)
        if (!extraPropertiesList.isEmpty()) {
            saveExtraProperties(issue, extraPropertiesList)
        }
        issue.extraProperties.addAll(extraPropertiesList)
        issue
    }

    Issue removeAssignedAdmin(String projectKey) {
        Issue issue = queryService.findByKey(projectKey)
        IssueExtraProperty property = issue.getExtraProperties().find { it.name == IssueExtraProperty.ASSIGNED_ADMIN}
        if(property != null) {
           issue.removeFromExtraProperties(property)
           property.delete(hard: true, flush: true)
        }
        issue
    }

    @Transactional
    void removeNoConsentAnswer(Issue issue) {
        Collection<IssueExtraProperty> iep = issue.getExtraProperties().findAll { it.name == IssueExtraProperty.NO_CONSENT_FORM_REASON}
        if (iep.size() > 0) {
            iep.each {
                issue.removeFromExtraProperties(it)
                it.delete(hard: true, flush: true)
            }

            if (issue.hasErrors()) {
                throw new DomainException(issue.getErrors())
            } else {
                issue.save(flush: true)
            }
        }
    }

    void saveFundings(Issue issue, Collection<Funding> fundings) {
        fundings?.each {
            it.setCreated(new Date())
            it.setProjectKey(issue.projectKey)
            issue.addToFundings(it)
            it.save(flush: true)
        }
    }

    Issue initIssue(Issue issue, IssueType type) {
        Issue newIssue = issue
        newIssue.setRequestDate(new Date())
        newIssue.setUpdateDate(new Date())
        if (!type.getName().equals(IssueType.CONSENT_GROUP.getName())) {
            newIssue.setApprovalStatus(IssueStatus.Pending.name)
        }
        newIssue.type = type.name
        newIssue.status = IssueStatus.Open.name
        newIssue.extraProperties = null
        newIssue.fundings = null
        newIssue
    }

    void deleteIssue(String projectKey) {
        Issue issue = queryService.findByKey(projectKey)
        if (issue != null) {
            List<ChecklistAnswer> checklistAnswers = ChecklistAnswer.findAllByProjectKey(projectKey)
            checklistAnswers?.each { it.delete(flush: true) }

            List<Comment> comments = Comment.findAllByProjectKey(projectKey)
            comments?.each { it.delete(flush: true) }

            List<ConsentCollectionLink> links = ConsentCollectionLink.findAllByProjectKey(projectKey)
            links?.each { it.delete(flush: true) }

            List<Funding> fundingList = queryService.findFundingsByProject(issue.projectKey)
            fundingList?.each { it.delete(flush: true) }

            Collection<StorageDocument> documents = queryService.getDocumentsForProject(projectKey)
            documents?.each { it.delete(flush: true) }

            Collection<IssueExtraProperty> issueExtraProperties = issue.getExtraProperties()
            issueExtraProperties?.each { it.delete(flush: true) }
        }
        issue.delete(flush: true)
        notifyService.sendRejectionProjectNotification(issue, getUser()?.displayName)
    }

    @Transactional
    void hardDeleteIssue(String projectKey) {
        Issue issue = queryService.findByKey(projectKey)
        if (issue != null) {

            List<IssueReview> review = IssueReview.findAllByProjectKey(projectKey)
            review?.each { it.delete(hard: true, flush: true) }

            List<Comment> comments = Comment.findAllByProjectKey(projectKey)
            comments?.each { it.delete(hard: true, flush: true) }

            List<Event> events = Event.findAllByProjectKey(projectKey)
            events?.each { it.delete(hard: true, flush: true) }

            Collection<StorageDocument> documents = queryService.getDocumentsForProject(projectKey)
            documents?.each {
                storageProviderService.removeStorageDocument(it, getUser()?.displayName)
                it.delete(hard: true, flush: true)
            }

            List<ConsentCollectionLink> links = queryService.findAllConsentCollectionLink(projectKey)
            links?.each { it.delete(hard: true, flush: true) }

            Collection<IssueExtraProperty> issueExtraProperties = issue.getExtraProperties()
            issueExtraProperties?.each { it.delete(hard: true) }

            issue.delete(hard: true, flush: true)
        }
    }

    @SuppressWarnings(["GroovyMissingReturnStatement", "GroovyAssignabilityCheck"])
    private Collection<IssueExtraProperty> findPropsForDeleting(Issue issue, Map<String, Object> input) {
        Collection<IssueExtraProperty> props = multiValuedPropertyKeys.collect {
            name ->
                if (input.get(name)) {
                     issue.getExtraProperties().findAll { it.name == name }
               }
        }.flatten().findAll { it != null }
        props
    }

    /**
     * Update or create a single-valued property for each of the single-valued property keys that could possibly be in the
     * input map.
     *
     * @param issue The Issue
     * @param input The map of input values
     */
    @SuppressWarnings("GroovyMissingReturnStatement")
    private Collection<IssueExtraProperty> getSingleValuedPropsForSaving(Issue issue, Map<String, Object> input) {
        Collection<IssueExtraProperty> props = singleValuedPropertyKeys.collect {
            name ->
                if (input.containsKey(name) && !(input.get(name) instanceof Collection)) {
                    def value = (String) input.get(name)
                    if (value) {
                        IssueExtraProperty extraProperty = issue.getExtraProperties().find { it.name == name }
                        if (!extraProperty) {
                            extraProperty = new IssueExtraProperty(issue: issue, name: name, value: value, projectKey: issue.projectKey)
                        } else {
                            extraProperty.value = value
                        }
                        extraProperty
                    }
                }
        }.findAll { it != null }
        props
    }

    /**
     * Update or create a multi-valued property for each of the multi-valued properties that could possibly be in the
     * input map.
     *
     * @param issue The Issue
     * @param input The map of input values
     */
    @SuppressWarnings(["GroovyMissingReturnStatement", "GroovyAssignabilityCheck"])
    private Collection<IssueExtraProperty> getMultiValuedPropsForSaving(Issue issue, Map<String, Object> input) {
        Collection<IssueExtraProperty> props = multiValuedPropertyKeys.collect {
            name ->
                if (input.containsKey(name)) {
                    def value = input.get(name)
                    if (value && value instanceof String) {
                        Collections.singletonList(new IssueExtraProperty(issue: issue, name: name, value: (String) value, projectKey: issue.projectKey))
                    } else if (value && value instanceof List) {
                        ((List<String>) value).collect {
                            new IssueExtraProperty(issue: issue, name: name, value: it, projectKey: issue.projectKey)
                        }
                    }
                }
        }.flatten().findAll { it != null }
        props
    }

    String getProjectType(String projectKey) {
        Issue issue = queryService.findByKey(projectKey)
        IssueType.valueOfName(issue?.getType())?.prefix?.toLowerCase()
    }

    static Collection<String> getAccessContacts(Map<String, List<String>> extraProperties) {
        Collection<String> accessContacts = extraProperties.findAll ({ it.key == IssueExtraProperty.PM }).values().flatten()
        accessContacts = accessContacts.isEmpty() ? extraProperties.findAll ({ it.key == IssueExtraProperty.ACTOR }).values().flatten() : accessContacts
        accessContacts
    }

}
