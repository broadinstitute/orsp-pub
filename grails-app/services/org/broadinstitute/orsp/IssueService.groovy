package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import grails.web.servlet.mvc.GrailsParameterMap
import groovy.util.logging.Slf4j

import org.broadinstitute.orsp.utils.IssueUtils

/**
 * This class handles the general update or creation of issues and nothing more.
 *
 * Transactional is applied only to certain methods which means that default != true for methods not marked as such.
 *
 */
@SuppressWarnings("GrMethodMayBeStatic")
@Slf4j
class IssueService {

    QueryService queryService

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
            IssueExtraProperty.APPROVAL
    ]


    Collection<String> multiValuedPropertyKeys = [
            IssueExtraProperty.PROJECT_QUESTIONNAIRE,
            IssueExtraProperty.ACTOR,
            IssueExtraProperty.AFFILIATIONS,
            IssueExtraProperty.NOT_RESEARCH,
            IssueExtraProperty.COLLABORATORS
    ]

    /**
     * Persist a new, unsaved issue
     *
     * @param issue The new issue
     * @return Persisted issue
     */
    @Transactional
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
    Issue updateIssue(Issue issue, GrailsParameterMap input) throws DomainException {
        // Top level properties that are set on the Issue object.
        if (input.get(IssueExtraProperty.SUMMARY)) {
            issue.setSummary((String) input.get(IssueExtraProperty.SUMMARY))
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
        def fundingParams = (GrailsParameterMap) input.get('funding')
        def propList = IssueUtils.convertNestedParamsToPropertyList(fundingParams)
        def newFundingList = propList.collect { p ->
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
            it.delete()
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

        propsToDelete.each {
            issue.removeFromExtraProperties(it)
            it.delete()
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
        issue
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
        if (extraPropertiesList.find {it.name == IssueExtraProperty.PROJECT_REVIEW_APPROVED} != null ) {
            updateProjectApproval(issue)
        }
        issue
    }

    // Todo This method doesn't handle funding changes. We should handle it when implementing edit functions
    @SuppressWarnings(["GroovyMissingReturnStatement"])
    Issue modifyIssueProperties (Issue issue, Object input) {
        Issue updatedIssue = issue
        input.collect { element ->
            if (issue.getProperties().get(element.key) != null && element.key != "fundings") {
                updatedIssue.(element.key) = element.value
                updatedIssue.setUpdateDate(new Date())
            }
        }
        updatedIssue.save(flush:true)
        updatedIssue
    }

    /** updateProjectApproval
     *  This method will check if a given issue has its general data and each of its attachment Approved,
     *  if this conditions are met, then we set its general issue status to 'Approved'
     * */
    void updateProjectApproval(Issue issue) {
        if (issue != null && issue.getProjectReviewApproved() && issue.attachmentApproved()) {
            issue.setApprovalStatus(IssueStatus.Approved.getName())
            issue.setUpdateDate(new Date())
            issue.save(flush:true)
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
        newIssue.setApprovalStatus("Pending")
        newIssue.type = type.name
        newIssue.status = IssueStatus.Open.name
        newIssue.extraProperties = null
        newIssue.fundings = null
        newIssue
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
                if (input.get(name)) {
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
                if (input.get(name)) {
                    def value = input.get(name)
                    if (value && value instanceof String) {
                        Collections.singletonList(new IssueExtraProperty(issue: issue, name: name, value: (String) value, projectKey: issue.projectKey))
                    } else {
                        ((List<String>) value).collect {
                            new IssueExtraProperty(issue: issue, name: name, value: it, projectKey: issue.projectKey)
                        }
                    }
                }
        }.flatten().findAll { it != null }
        props
    }

}
