package org.broadinstitute.orsp.api

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.EventType
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueReview
import org.broadinstitute.orsp.IssueReviewService
import org.broadinstitute.orsp.PersistenceService

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class IssueReviewController extends AuthenticatedController {

    IssueReviewService issueReviewService

    def save() {
        Gson gson = new Gson()
        IssueReview issueReview = parseIssueReview(gson.toJson(request.JSON))
        Issue issue = queryService.findByKey(issueReview.projectKey)
        if (issue == null) {
            response.status = 404
            render([message: "Project key does not exist"] as JSON)
        } else {
            issueReviewService.create(issueReview)
            persistenceService.saveEvent(issueReview.projectKey, getUser()?.displayName, "Edits Added", EventType.SUBMIT_EDITS)
            response.status = 201
            render([issueReview] as JSON)
        }
    }

    def update() {
        Gson gson = new Gson()
        IssueReview issueReviewFormer = issueReviewService.findByProjectKey(params.projectKey)

        if (issueReviewFormer == null) {
            response.status = 404
            render([message: "Issue review does not exist"] as JSON)
        }
        IssueReview ir = parseIssueReview(gson.toJson(request.JSON))
        issueReviewFormer.suggestions = ir.suggestions
        issueReviewFormer.save(flush: true)
        response.status = 200
        render([issueReviewFormer] as JSON)
    }

    def delete() {
        issueReviewService.delete(params.projectKey)
        if (params.type == 'reject') {
            persistenceService.saveEvent(params.projectKey, getUser()?.displayName, "Edits Rejected", EventType.REJECT_EDITS)
        }
        response.status = 200
        response
    }

    def show() {
        IssueReview issueReview = issueReviewService.findByProjectKey(params.id)
        if (issueReview == null) {
            response.status = 204
        } else {
            response.status = 200
            render(issueReview as JSON)
        }
    }

    private IssueReview parseIssueReview(String json) {
       new Gson().fromJson(json, IssueReview.class)
    }
}
