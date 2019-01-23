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

    def downloadFillablePDF () {
        try {
            String fileName = 'Broad_DUL_Draft-Cover_Letter_Form_Fillable.pdf'
            def resource = this.class.classLoader.getResource(fileName)
            response.setHeader('Content-disposition', "attachment; ${fileName}")
            response.setHeader('Content-Length', 'file-size')
            response.setContentType('application/pdf')
            response.outputStream << resource.openStream()
        } catch (Exception e){
            response.status = 500
            render([error: "${e}"] as JSON)
        }
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
            notifyService.sendAdminNotification("Consent Group", consent)
            notifyService.sendConsentGroupSecurityInfo(issue, user)
            notifyService.sendConsentGroupRequirementsInfo(issue, user)
            consent.status = 201
            render([message: consent] as JSON)
        } else {
            Response response = Response.status(400)
            response.entity("Invalid project key")
            render([message: response] as JSON)
        }
    }

    def approveConsentGroup() {
        Gson gson = new Gson()
        Object input = gson.fromJson(gson.toJson(request.JSON), Object.class)
        String projectKey = params.id
        Issue issue = queryService.findByKey(projectKey)
        try {
            Issue updatedIssue = issueService.modifyIssueProperties(issue, input)
            render([message: updatedIssue])
        } catch(Exception e) {
            render([error: e.message] as JSON)
        }
    }

    def delete() {
        Issue issue = queryService.findByKey(params.consentKey)
        if(issue != null) {
            issueService.deleteIssue(params.consentKey)
            response.status = 200
            render([message: 'Consent Group was deleted'] as JSON)
        } else {
            response.status = 404
            render([message: 'Consent Group not found'] as JSON)
        }
    }

    def update() {
        Gson gson = new Gson()
        Map project = gson.fromJson(gson.toJson(request.JSON), Map.class)
        Issue issue = Issue.findByProjectKey(params.projectKey)
        issueService.updateIssue(issue, project)
        response.status = 200
        render([message: 'Consent Group was updated'] as JSON)
    }
}
