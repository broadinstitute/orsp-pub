package org.broadinstitute.orsp.api

import grails.rest.Resource
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.Comment
import org.broadinstitute.orsp.EventType
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueReviewService
import org.broadinstitute.orsp.IssueType
import org.broadinstitute.orsp.NotifyArguments


@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class ClarificationController extends AuthenticatedController {

    IssueReviewService issueReviewService

    def addClarificationRequest() {
        Issue issue = queryService.findByKey(params.id)
        if (params.comment) {
            Comment comment = persistenceService.saveComment(issue.projectKey,  getUser()?.displayName, params.comment)
            if (comment == null || comment.hasErrors()) {
              handleException(new Exception("Error saving comment for issue '" + params.id + "': null"))
            }
            List<String> toAddresses = new ArrayList<>()
            String fromAddress = (String) getUser()?.emailAddress

            String editCreatorEmail = userService.findUser(
                    issueReviewService.findByProjectKey(issue.projectKey)?.getEditCreatorName())?.emailAddress
            if (editCreatorEmail != null) {
                toAddresses.add(editCreatorEmail)
            }

            if (issue.getType() != IssueType.CONSENT_GROUP.name) {
                if (issue.getPMs().toString() == issue.getReporter().toString()) {
                    toAddresses.addAll(userService.findUser(issue.getReporter())?.collect {it.emailAddress})
                } else {
                    toAddresses.addAll(userService.findUser(issue.getReporter())?.collect {it.emailAddress})
                    toAddresses.addAll(userService.findUsers(issue.getPMs())?.collect {it.emailAddress})
                }
            } else {
                toAddresses.addAll(userService.findUser(issue.getReporter())?.collect {it.emailAddress})
            }
            // Extra check to cover error condition of empty PMs
            if (toAddresses.isEmpty()) {
                log.error("Issue " + issue.projectKey + " has empty PMs.")
                toAddresses.addAll(notifyService.getOrspSpecialRecipients())
            }

            try {
                notifyService.sendClarificationRequest(
                        new NotifyArguments(
                                toAddresses: toAddresses,
                                fromAddress: fromAddress,
                                subject: "Clarification Requested: " + issue.projectKey,
                                comment: comment.description,
                                user: getUser(),
                                issue: issue))
                persistenceService.saveEvent(issue.projectKey, getUser()?.displayName, "Clarification Requested", EventType.REQUEST_CLARIFICATION)
                transitionService.handleIntake(issue, getProjectManagersForIssue(issue)*.userName)
                response.status = 201
            } catch (Exception e) {
                handleException(e)
            }
        }
        response
    }

    def collectionRequestClarification() {
        Issue issue = queryService.findByKey(params.id)
        Issue consent = queryService.findByKey(params.consentKey)
        if (params.comment) {
            Comment comment = persistenceService.saveComment(issue.projectKey,  getUser()?.displayName, params.comment)
            String toAddresses = userService.findUser(params.pm)?.collect {it.emailAddress}
            String fromAddress = getUser()?.emailAddress
            try {
                Map<String, String> values = new HashMap<>()
                values.put("isLink", "true")
                values.put("summary", consent.getSummary())
                notifyService.sendClarificationRequest(
                        new NotifyArguments(
                                toAddresses: [toAddresses],
                                fromAddress: fromAddress,
                                subject: "Clarification Requested: " + issue.projectKey,
                                comment: comment.description,
                                user: getUser(),
                                issue: issue,
                                values: values))
                persistenceService.saveEvent(issue.projectKey, getUser()?.displayName, "Clarification Requested", EventType.REQUEST_CLARIFICATION)
                transitionService.handleIntake(issue, getProjectManagersForIssue(issue)*.userName)
                response.status = 201
            } catch (Exception e) {
                handleException(e)
            }
        }
    }
}
