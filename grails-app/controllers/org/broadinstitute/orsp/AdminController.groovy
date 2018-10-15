package org.broadinstitute.orsp

import grails.converters.JSON

class AdminController extends AuthenticatedController {

    def index() {
        def collectionLinks = queryService.findAllCollectionLinks()
        render(view: "/admin/index", model: [
                consentCollections: collectionLinks
        ])
    }

    // TODO: Move db logic to service
    @SuppressWarnings("GroovyAssignabilityCheck")
    def createConsentCollection() {
        List<String> errors = new ArrayList<>()
        if (!params.projectKey) {
            errors.add("Project is required")
        }
        if (!params.consentKey) {
            errors.add("Consent Group is required")
        }
        if (!params.sampleCollectionId) {
            errors.add("Sample Collection is required")
        }
        if (!errors.isEmpty()) {
            flash.error = "Unable to create consent: " + errors.join("; ")
            redirect(controller: 'admin', action: 'index')
        } else {
            def consent = new ConsentCollectionLink(
                    projectKey: params.projectKey,
                    consentKey: params.consentKey,
                    sampleCollectionId: params.sampleCollectionId,
                    creationDate: new Date()
            )
            if (consent.save(flush: true)) {
                flash.message = "Successfully created a new consent collection link."
                redirect(controller: 'admin', action: 'index')
            } else {
                flash.error = "Unable to create consent"
                redirect(controller: 'admin', action: 'index')
            }
        }
    }

    def reviewCategories() {
        def issues = queryService.findByQueryOptions(new QueryOptions(issueTypeNames: [IssueType.IRB.name]))
        render(view: "/admin/reviewCategories", model: [issues: issues])
    }

    def fundingReport() {
        render(view: "/admin/fundingReport")
    }

    def close() {
        def issue = queryService.findByKey(params.id)
        transitionService.close(issue, params.comment, getUser()?.displayName)
        flash.message = "Successfully closed isssue: " + issue.projectKey
        redirect(controller: 'admin', action: 'reviewCategories')
    }

    def getMatchingConsents() {
        def response = []
        queryService.findIssuesByConsentTerm(params.term).each {
            response << [
                    "id": it.projectKey,
                    "label": it.projectKey + " ( " + it.summary + " )",
                    "value": it.projectKey
            ]
        }
        render response as JSON
    }

    def getMatchingProjects() {
        def response = []
        QueryOptions
        queryService.findProjectsBySearchTerm(params.term).each {
            response << [
                    "id": it.projectKey,
                    "label": it.summary,
                    "value": it.projectKey
            ]
        }
        render response as JSON
    }

    def getMatchingUnConsentedSampleCollections() {
        def response = []
        String term = params.term
        queryService.getUnConsentedSamples().find {
            it.name.toLowerCase().contains(term.toLowerCase()) ||
            it.collectionId.toLowerCase().contains(term.toLowerCase()) ||
            it.groupName.toLowerCase().contains(term.toLowerCase()) ||
            it.category.toLowerCase().contains(term.toLowerCase())
        }.each {
            response << [
                    "id": it.id,
                    "label": it.id + " ( " + it.name + ": " + it.category + " )",
                    "value": it.id,
                    "group": it.groupName,
                    "category": it.category
            ]
        }
        render response as JSON
    }

}
