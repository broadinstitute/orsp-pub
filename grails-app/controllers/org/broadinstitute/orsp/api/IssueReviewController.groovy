package org.broadinstitute.orsp.api

import com.google.gson.Gson
import grails.converters.JSON
import groovy.util.logging.Slf4j
import javassist.NotFoundException
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
        if(issue == null) {
            throw new NotFoundException()
        }
        issueReviewService.create(issueReview)
        response.status = 201
    }

    def delete() {
        issueReviewService.delete(params.projectKey)
        response.status = 200
    }

    def show() {
        IssueReview issueReview = issueReviewService.findByProjectKey(params.projectKey)
        issueReview.status = 200
        render([message: issueReview] as JSON)
    }

}
