package org.broadinstitute.orsp.api

import com.google.gson.Gson
import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueReview
import org.broadinstitute.orsp.IssueReviewService

@Slf4j
class IssueReviewController extends AuthenticatedController {

    IssueReviewService issueReviewService

    def save() {
        Gson gson = new Gson()
        IssueReview issueReview = gson.fromJson(gson.toJson(request.JSON), IssueReview.class)
        Issue issue = queryService.findByKey(issueReview.projectKey)
        if (issue == null) {
            response.status = 404
            render([message: "Project key does not exist"] as JSON)
        } else {
            issueReviewService.create(issueReview)
            response.status = 201
            render([issueReview] as JSON)
        }

    }

    def delete() {
        issueReviewService.delete(params.projectKey)
        response.status = 200
        response
    }

    def show() {
        IssueReview issueReview = issueReviewService.findByProjectKey(params.projectKey)
        if (issueReview == null) {
            response.status = 404
            render([message: "Issue review does not exist"] as JSON)
        }
        response.status = 200
        render([issueReview] as JSON)
    }

}
