package org.broadinstitute.orsp.webservice

import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.ConsentService
import org.broadinstitute.orsp.DataUseRestriction
import org.broadinstitute.orsp.IssueStatus
import org.broadinstitute.orsp.IssueType
import org.broadinstitute.orsp.QueryOptions
import org.broadinstitute.orsp.QueryService
import org.broadinstitute.orsp.utils.IssueUtils
import org.grails.plugins.web.taglib.ApplicationTagLib

@Slf4j
class ApiService {

    def grailsApplication
    QueryService queryService
    ConsentService consentService
    private ApplicationTagLib applicationTagLib

    private ApplicationTagLib getTagLib() {
        if (!applicationTagLib) {
            applicationTagLib = (ApplicationTagLib) grailsApplication.mainContext.getBean('org.grails.plugins.web.taglib.ApplicationTagLib')
        }
        applicationTagLib
    }

    Collection<String> getBookitSummaries() {
        QueryOptions options = new QueryOptions()
        options.setIssueStatusNames([IssueStatus.Approved.name, IssueStatus.Completed.name])
        options.issueTypeNames.addAll(
                [IssueType.IRB.name,
                 IssueType.NHSR.name,
                 IssueType.NE.name])
        queryService.findByQueryOptions(options).collect{it.projectKey}.unique().sort()
    }

    Collection<Map<String, Object>> getProjectSummaries() {
        filterUnique(queryService.findIssueSummaries().collect {
            String link = ""
            if (it.type == IssueType.CONSENT_GROUP.name) {
                link = getTagLib().createLink([controller: 'newConsentGroup', action: 'main', absolute: true, params: [consentKey: it.projectKey]])
            } else {
                link = getTagLib().createLink([controller: 'project', action: 'main', absolute: true, params: [projectKey: it.projectKey]])
            }
            [
                    "key": it.projectKey,
                    "label": it.projectKey + " (" + it.summary + ")",
                    "type": it.type,
                    "status":  it.approvalStatus != IssueStatus.Legacy.name ? it.approvalStatus : it.status,
                    "description": it.description,
                    "url": link
            ]
        })
    }

    @SuppressWarnings("GroovyMissingReturnStatement")
    Collection<Map<String, Object>> getSampleSummaries() {
        Map<String, String> projectTypeMap = queryService.getIssueKeysWithType()
        filterUnique(queryService.findCollectionLinksWithSamples().
                collect { link ->
                    def consentLink = getTagLib().createLink([controller: 'newConsentGroup', action: 'main', params: [consentKey: link.consentKey], absolute: true])
                    def sampleCollectionName = link.sampleCollection?.name
                    // Possibility exists for bad data in consent collection link table such that we might not have a valid project to link to.
                    // See https://broadinstitute.atlassian.net/browse/DSDECOM-58 for more info.
                        def projectLink = getTagLib().createLink([controller: "project", action: 'main', params: [projectKey: link.projectKey], absolute: true])
                        [
                                "sampleCollection": link.sampleCollectionId,
                                "sampleCollectionName": sampleCollectionName,
                                "project": link.projectKey,
                                "projectUrl": projectLink,
                                "consent": link.consentKey,
                                "consentUrl": consentLink
                        ]
                })
    }

    Collection<Map> getConsents() {
        def link = getTagLib().createLink([controller: IssueType.CONSENT_GROUP.controller, action: 'show',  absolute: true])
        // Map of consent group key to minimized data use restriction string
        Map<String, String> durMap = DataUseRestriction.findAll().
                collectEntries { [(it.consentGroupKey): consentService.getMinimizedSummary(it).join("\n")] }
        filterUnique(queryService.getConsentGroupInfoWithSamples().collect {
            // Data Use Restriction is either what we calculated above, "Pending" if we have a
            // DU Letter but no categorized restriction, or null.
            String project = it.get("project_key") as String
            if (!durMap.containsKey(project) &&
                    (it.get("dul") as Boolean)) {
                durMap.put(project, "Pending")
            }
            [
                    "key": project,
                    "label": project + " (" + it.get("summary") + ")",
                    "sampleCollections": it.get("sample_collections"),
                    "dataUseRestriction": durMap.get(project),
                    "url": link + "/" + project
            ]
        })
    }

    private static Collection<Map> filterUnique(Collection<Map> map) {
        map.unique() - null
    }

}
