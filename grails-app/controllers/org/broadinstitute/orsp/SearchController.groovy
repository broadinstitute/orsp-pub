package org.broadinstitute.orsp

import grails.converters.JSON
import org.broadinstitute.orsp.utils.IssueUtils
import org.broadinstitute.orsp.webservice.OntologyTerm
import org.grails.plugins.web.taglib.ApplicationTagLib

import java.text.SimpleDateFormat

@SuppressWarnings("GroovyAssignabilityCheck")
class SearchController implements UserInfo {

    UserService userService
    OntologyService ontologyService
    QueryService queryService
    PermissionService permissionService

    SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy")
    ApplicationTagLib applicationTagLib = grailsApplication.mainContext.getBean('org.grails.plugins.web.taglib.ApplicationTagLib')

    boolean before() {
        if (!session.user) {
            session.savedParams = params
            redirect(controller: 'logout', action: 'required')
            return false
        }
        true
    }

    def index() {
        ["statusNames": IssueStatus.values().sort { it.sequence }.collect { it.name }]
    }

    def search() {
    }

    def getMatchingConsents() {
        def response = []
        queryService.findIssuesByConsentTerm(params.term).each {
            response << [
                    "id": it.projectKey,
                    "label": it.projectKey + " (" + it.summary + ")",
                    "value": it.projectKey
            ]
        }
        render response as JSON
    }

    def getMatchingIssues() {
        User user = getUser()
        String userName = user?.userName
        Boolean isAdmin = isAdmin()
        Boolean isViewer = isViewer()
        Collection response = []
        queryService.findIssuesBySearchTermAsProjectKey(params.term).each {
            String link = IssueUtils.generateLinkForRedirect(it.type, it.projectKey, null)
            response << [
                    id: it.id,
                    label: it.projectKey + " (" + it.summary + ")",
                    value: it.projectKey,
                    url: link,
                    reporter: userService.findUser(it.reporter).displayName,
                    linkDisabled: permissionService.userHasIssueAccess(it.reporter, it.extraProperties, userName, isAdmin, isViewer),
                    pm: it.pm,
                    actor: it.actor
            ]
        }
        render response as JSON
    }

    def getMatchingUsers() {
        def response = []
        userService.findUsersBySearchTerm(params.term).each {
            response << [
                    "id": it.userName,
                    "label": it.displayName + " (" + it.emailAddress + ")",
                    "value": it.displayName
            ]
        }
        render response as JSON
    }

    def getMatchingCollections() {
        def response = []
        queryService.findCollectionsBySearchTerm(params.term).each {
            response << [
                    "id": it.collectionId,
                    "label": it.collectionId + " (" + it.name + ": " + it.category + ")",
                    "value": it.collectionId,
                    "group": it.groupName,
                    "category": it.category
            ]
        }
        render response as JSON
    }

    def generalDataTablesJsonSearch() {
        QueryOptions options = new QueryOptions()
        if (params.key) options.projectKey = params.key
        if (params.type) options.issueTypeNames.addAll(params.type)
        if (params.status) options.issueStatusNames.addAll(params.status)
        if (params.text) options.freeText = params.text
        if (params.userName) options.userNames << params.userName
        if (params.funding) options.fundingInstitute = params.funding
        if (params.irb) options.irbOfRecord = params.irb
        def columns = []
        columns << ["sTitle": "Key", "sType": "ticket"]
        columns << ["sTitle": "Title"]
        columns << ["sTitle": "Type"]
        columns << ["sTitle": "Status"]
        columns << ["sTitle": "Updated"]
        def data = []
        queryService.findByQueryOptions(options).each {
            def link = applicationTagLib.createLink([controller: it.controller, action: 'show'])
            data << [
                    '<a href="' + link + "/" + it.projectKey + '">' + it.projectKey + '</a>',
                    it.summary,
                    it.type,
                    it.status,
                    format.format(it.updateDate)
            ]
        }
        def returnData = [
                "aaData"   : data,
                "aoColumns": columns
        ]
        render returnData as JSON
    }

    def generalReactTablesJsonSearch() {
        User user = getUser()
        String userName = user?.userName
        QueryOptions options = new QueryOptions()
        if (params.projectKey) options.setProjectKey(params.projectKey)
        if (params.text) options.setFreeText(params.text)
        if (params.userName) options.setUserName(params.userName)
        if (params.funding) options.setFundingInstitute(params.funding)
        if (params.type) options.getIssueTypeNames().addAll(params.type)
        if (params.status) options.getIssueStatusNames().addAll(params.status)
        if (params.irb) options.getIrbsOfRecord().addAll(params.irb)
        Collection rows = []
        Boolean isAdmin = isAdmin()
        Boolean isViewer = isViewer()
        // Only query if we really have values to query for.
        if (options.projectKey ||
                options.issueTypeNames ||
                options.issueStatusNames ||
                options.freeText ||
                options.userName ||
                options.fundingInstitute ||
                options.irbsOfRecord) {
            rows = queryService.findIssues(options).collect {
                String link = IssueUtils.generateLinkForRedirect(it.type, it.projectKey, null)
                [
                        link: link,
                        key: it.projectKey,
                        reporter: it.reporter,
                        linkDisabled: permissionService.userHasIssueAccess(it.reporter, it.extraProperties, userName, isAdmin, isViewer),
                        title: it.summary,
                        type: it.type,
                        status: it.getApprovalStatus(),
                        updated: it.updateDate ? format.format(it.updateDate): "",
                        expiration: it.expirationDate ? format.format(it.expirationDate) : "",
                        projectAccessContact: it.accessContacts
                ]
            }
        }
        render ([data: rows] as JSON)
    }

    def projectKeyAutocomplete() {
        List<Map> data = queryService.projectKeyAutocomplete(params.term)
        render data as JSON
    }

    def dataUseSearch() {
        QueryOptions options = new QueryOptions()
        options.issueTypeNames.add(IssueType.CONSENT_GROUP.name)
        options.dataUseSearch = true
        if (params.collection) options.collection = params.collection
        if (params.consent) options.consent = params.consent
        if (params.investigatorName) options.investigatorName = params.investigatorName
        if (params.generalUse) options.generalUse = true
        if (params.tiered) options.tiered = true
        if (params.dataUseInterpretation) options.dataUseInterpretation = params.dataUseInterpretation
        if (params.proprietaryData) options.proprietaryData = true
        if (params.commercial) options.commercialUseExcluded = true
        if (params.diseaseRestrictions) options.diseaseRestrictions = params.diseaseRestrictions
        if (params.populationRestrictions) options.populationRestrictions = params.populationRestrictions
        if (params.gender) options.gender = params.gender
        if (params.pediatric) options.pediatric = true
        if (params.beforeAfter) options.beforeAfter = params.beforeAfter
        if (params.dateRestriction) options.dateRestriction = Date.parse('mm/dd/yyyy', params.dateRestriction)
        if (params.methodsResearchExcluded) options.methodsResearchExcluded = true
        List<Issue> issues = queryService.findByQueryOptions(options)
        render (view: '_dataUseRecords', model: ["issues": issues])
    }

    def getMatchingPopulationOntologies() {
        List<OntologyTerm> matches = ontologyService.getPopulationMatches((String) params.term)
        render(text: matches as JSON, contentType: "application/json")
    }

    def ajaxQuickSearch() {
        QueryOptions options = new QueryOptions(
                max: params.int('max') ?: 10,
                freeText: params.query
        )
        def data = queryService.findByQueryOptions(options).collect {
            [key: it.projectKey, summary: it.summary]
        }
        render([text: data as JSON, contentType: "application/json"])
    }

}
