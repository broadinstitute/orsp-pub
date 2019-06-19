package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.Comment
import org.broadinstitute.orsp.EventType
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueType
import org.broadinstitute.orsp.NotifyArguments


@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class ClarificationController extends AuthenticatedController {

    def addClarificationRequest() {
        Issue issue = queryService.findByKey(params.id)
        if (params.comment) {
            Comment comment = persistenceService.saveComment(issue.projectKey,  getUser()?.displayName, params.comment)
            if (comment == null || comment.hasErrors()) {
                log.error("Error saving comment for issue '" + params.id + "': null")
                response.status = 500
                render([message: "Error saving comment"])
            }

            List<String> toAddresses = new ArrayList<>()
            String fromAddress = (String) getUser()?.emailAddress

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
                response.status = 201
            } catch (Exception e) {
                response.status = 500
                render([error: "${e}"] as JSON)
            }
        }
        if(params.type == "link") {
            redirect([action: "main", controller: "project", params: [tab: "consent-groups", projectKey: params.id]])
        }
        response
    }
}
