package org.broadinstitute.orsp.api

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueType
import org.broadinstitute.orsp.models.ConsentGroup

import javax.ws.rs.core.Response

@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class NewConsentGroupController extends AuthenticatedController {

    def show() {
        render(view: "/newConsentGroup/index")
    }

    def save() {
        Gson gson = new Gson()
        ConsentGroup consentGroup = gson.fromJson(gson.toJson(request.JSON), ConsentGroup.class)
        Issue source = queryService.findByKey(consentGroup.source)
        if(source != null) {
            Issue consent = issueService.createIssue(IssueType.CONSENT_GROUP, consentGroup.getIssue())
            consent.status = 201
            render([message: consent] as JSON)
        } else {
            Response response = Response.status(400)
            response.entity("Invalid project key")
            render([message: response] as JSON)
        }
    }
}

