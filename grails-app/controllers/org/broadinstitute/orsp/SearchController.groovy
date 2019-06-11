package org.broadinstitute.orsp

import grails.converters.JSON
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
        def response = []
        queryService.findIssuesBySearchTermAsProjectKey(params.term).each {
            def link = it.controller == IssueType.CONSENT_GROUP.controller ?
                    applicationTagLib.createLink([controller: it.controller, action: 'show', params: [id: it.projectKey], absolute: true]) :
                    applicationTagLib.createLink([controller: "project", action: 'main', params: [projectKey: it.projectKey]])
            response << [
                    id: it.id,
                    label: it.projectKey + " (" + it.summary + ")",
                    value: it.projectKey,
                    url: link
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
        def user = getUser()
        def userName = user.userName
        QueryOptions options = new QueryOptions()
        if (params.projectKey) options.setProjectKey(params.projectKey)
        if (params.text) options.setFreeText(params.text)
        if (params.userName) options.setUserName(params.userName)
        if (params.funding) options.setFundingInstitute(params.funding)
        if (params.type) options.getIssueTypeNames().addAll(params.type)
        if (params.status) options.getIssueStatusNames().addAll(params.status)
        if (params.irb) options.getIrbsOfRecord().addAll(params.irb)
        def rows
        def isAdmin = isAdmin()
        def isViewer = isViewer()
        // Only query if we really have values to query for.
        if (options.projectKey ||
                options.issueTypeNames ||
                options.issueStatusNames ||
                options.freeText ||
                options.userName ||
                options.fundingInstitute ||
                options.irbsOfRecord) {
            rows = queryService.findIssues(options).collect {
                def link = it.type == IssueType.CONSENT_GROUP.name ?
                        applicationTagLib.createLink([controller: "newConsentGroup", action: 'show', params: [id: it.projectKey], absolute: true]) :
                        applicationTagLib.createLink([controller: "project", action: 'main', params: [projectKey: it.projectKey], absolute: true])
                [
                        link: link,
                        key: it.projectKey,
                        reporter: it.reporter,
                        linkDisabled: permissionService.issueIsForbidden(it, userName, isAdmin, isViewer),
                        title: it.title,
                        type: it.type,
                        status: it.status,
                        updated: format.format(it.updateDate),
                        expiration: it.expirationDate ? format.format(it.expirationDate) : ""
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

    def getMatchingDiseaseOntologies() {
        String term = params.q ?: params.term
        List<OntologyTerm> matches = ontologyService.getDiseaseMatches(term)
        render(text: matches as JSON, contentType: "application/json")
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
