package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import grails.web.servlet.mvc.GrailsParameterMap
import groovy.json.JsonBuilder
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.models.Project
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
            IssueExtraProperty.SUBMISSION_TYPE]

    Collection<String> multiValuedPropertyKeys = [
            IssueExtraProperty.ACTOR,
            IssueExtraProperty.AFFILIATIONS,
            IssueExtraProperty.NOT_RESEARCH,
            IssueExtraProperty.PI,
            IssueExtraProperty.PM]

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

    Issue updateProject(Issue issue, Project project) throws DomainException {
        IssueType type = IssueType.valueOfName(issue.type)
        issue.setProjectKey(QueryService.PROJECT_KEY_PREFIX + type.prefix + "-")
        if (issue.hasErrors()) {
            throw new DomainException(issue.getErrors())
        } else {
            issue.save(flush: true)
        }
        issue.setProjectKey(issue.projectKey + issue.id)

        def fundingList = project.getFundingList(issue.getProjectKey())

        fundingList.each {
            issue.addToFundings(it)
            it.save()
        }

        issue.setExpirationDate(null)



//
//        Collection<IssueExtraProperty> propsToSave = getSingleValuedPropsForSaving(issue, project)
//        propsToSave.addAll(getMultiValuedPropsForSaving(issue, input))
//
//
//        propsToSave.each {
//            it.save()
//        }

        if (issue.hasErrors()) {
            throw new DomainException(issue.getErrors())
        }
        else {
            issue.save(flush: true)
        }
        issue
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
