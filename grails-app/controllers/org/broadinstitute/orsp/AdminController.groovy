package org.broadinstitute.orsp

import grails.converters.JSON
import groovy.json.JsonOutput

class AdminController extends AuthenticatedController {

    def index() {}


    def createConsentCollection() {
        String projectKey = params['projectKey']
        String consentKey = params['consentKey']
        String sampleCollectionId = params['sampleCollectionId']
        List<String> errors = validateConsentCollectionLinkFields(projectKey, consentKey, sampleCollectionId)
        if (!errors.isEmpty()) {
            render(status: 400, text: errors as JSON, contentType: 'application/json')
        } else {
            Collection<ConsentCollectionLink> existing = queryService.findCollectionLinks(projectKey, consentKey, sampleCollectionId)
            Collection<ConsentCollectionLink> associated = queryService.findCollectionLinksBySample(sampleCollectionId)
            associated.removeAll { it.consentKey.equals(consentKey) }
            if (existing?.size() > 0) {
                render(status: 409, text: JsonOutput.toJson("Conflict: consent collection link exists"), contentType: 'application/json')
            } else if (!associated.isEmpty()) {
                render(status: 409, text: JsonOutput.toJson("Conflict: sample collection is associated to a different consent group"), contentType: 'application/json')
            } else {
                try {
                    ConsentCollectionLink ccl = persistenceService.saveConsentCollectionLink(projectKey, consentKey, sampleCollectionId)
                    if (ccl.errors?.allErrors?.size() > 0) {
                        render(status: 500, text: ccl.errors.allErrors as JSON, contentType: 'application/json')
                    } else {
                        render(status: 201, text: ccl as JSON, contentType: 'application/json')
                    }
                } catch (Exception e) {
                    render(status: 500, text: e as JSON, contentType: 'application/json')
                }
            }
        }
    }

    private List<String> validateConsentCollectionLinkFields(String projectKey, String consentKey, String sampleCollectionId) {
        Set<IssueType> projectTypes = EnumSet.of(IssueType.IRB, IssueType.NE, IssueType.NHSR)
        List<String> errors = new ArrayList<>()
        if (!projectKey || projectKey?.isEmpty()) {
            errors.add("Project Key is a required parameter")
        } else {
            Issue issue = queryService.findByKey(projectKey)
            if (!issue) {
                errors.add("Project Key must refer to a valid project")
            }
            if (!projectTypes*.name.contains(issue?.type)) {
                errors.add("Project Key must refer to an IRB, Not Engaged, or Not Human Subjects project")
            }
        }
        if (!consentKey || consentKey?.isEmpty()) {
            errors.add("Consent Key is a required parameter")
        } else {
            Issue issue = queryService.findByKey(consentKey)
            if (!issue) {
                errors.add("Consent must refer to a valid Consent Group")
            }
            if (![IssueType.CONSENT_GROUP.name].contains(issue?.type)) {
                errors.add("Consent Key must refer to a Consent Group project")
            }
        }
        if (!sampleCollectionId || sampleCollectionId?.isEmpty()) {
            errors.add("Sample Collection is a required parameter")
        } else {
            SampleCollection sampleCollection = queryService.findCollectionById(sampleCollectionId)
            if (!sampleCollection) {
                errors.add("Sample Collection must refer to a valid Sample Collection")
            }
        }
        errors
    }

    def close() {
        def issue = queryService.findByKey(params.id)
        transitionService.close(issue, params.comment, getUser()?.displayName)
        flash.message = "Successfully closed isssue: " + issue.projectKey
        redirect(controller: 'admin', action: 'reviewCategories')
    }

}
