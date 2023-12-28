package org.broadinstitute.orsp.api

import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.ReviewerService
import org.broadinstitute.orsp.Reviewers
import org.broadinstitute.orsp.utils.IssueUtils

import java.text.SimpleDateFormat

@Slf4j
class ReviewerController extends AuthenticatedController{

    ReviewerService reviewerService

    def index() {
        try {
            List<Reviewers> reviewers = reviewerService.getReviewers()
            render reviewers as JSON
        } catch(Exception e) {
            handleException(e)
        }
    }

    def addNewReviewer() {
        try {
            Map<String, Object> reviewerData = IssueUtils.getJson(Map.class, request.JSON)
            reviewerService.addReviewer(reviewerData)
            response.status = 200
        } catch (Exception e) {
            handleException(e)
        }
    }

    def updateReviewer() {
        try {
            Map<String, Object> reviewerData = IssueUtils.getJson(Map.class, request.JSON)
            reviewerService.updateReviewer(reviewerData)
        } catch (Exception e) {
            handleException(e)
        }
    }

    def deleteReviewer() {
        try {
            reviewerService.deleteReviewer(params.name)
            response.status = 200
        } catch (Exception e) {
            handleException(e)
        }
    }

    def reviewerAssignedCount() {
        try {
            def result = reviewerService.countReviewerAssigned()
            render result
        } catch (Exception e) {
            handleException(e)
        }
    }

    def getReviewerProjectCount() {
        try {
            Map<String, Object> reviewerjson = IssueUtils.getJson(Map.class, request.JSON)
            def result = reviewerService.countReviewerProjects(reviewerjson)
            render result
        } catch (Exception e) {
            handleException(e)
        }
    }
}
