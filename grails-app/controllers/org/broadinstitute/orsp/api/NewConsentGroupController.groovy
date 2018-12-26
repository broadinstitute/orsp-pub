package org.broadinstitute.orsp.api

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.ConsentCollectionLink
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueType

import javax.ws.rs.core.Response

@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class NewConsentGroupController extends AuthenticatedController {

    def show() {
        render(view: "/newConsentGroup/index")
    }

    def save() {
        Gson gson = new Gson()
        Issue issue = gson.fromJson(gson.toJson(request.JSON), Issue.class)
        Issue source = queryService.findByKey(issue.getSource())
        if(source != null) {
            issue.setRequestDate(new Date())
            Issue consent = issueService.createIssue(IssueType.CONSENT_GROUP, issue)

            try {
                // If any sample collections were linked, we need to add them to the consent group.
                def sampleCollectionIds = []
                if (issue.getSamples()) { sampleCollectionIds.addAll(issue.getSamples()) }
                if (sampleCollectionIds.isEmpty()) {
                    new ConsentCollectionLink(
                            projectKey: source.projectKey,
                            consentKey: consent.projectKey,
                            sampleCollectionId: null,
                            creationDate: new Date()
                    ).save(flush: true)
                } else {
                    sampleCollectionIds.each {
                        new ConsentCollectionLink(
                                projectKey: source.projectKey,
                                consentKey: consent.projectKey,
                                sampleCollectionId: it,
                                creationDate: new Date()
                        ).save(flush: true)
                    }
                }
            } catch (Exception e) {
                flash.error = e.getMessage()
            }
            consent.status = 201
            render([message: consent] as JSON)
        } else {
            Response response = Response.status(400)
            response.entity("Invalid project key")
            render([message: response] as JSON)
        }
    }
}

