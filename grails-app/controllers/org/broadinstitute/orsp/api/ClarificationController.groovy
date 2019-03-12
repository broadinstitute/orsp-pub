package org.broadinstitute.orsp.api

import grails.rest.Resource
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.Comment
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueType
import org.broadinstitute.orsp.NotifyArguments


@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class ClarificationController extends AuthenticatedController{

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

            notifyService.sendComment(
                    new NotifyArguments(
                            toAddresses: toAddresses,
                            fromAddress: fromAddress,
                            subject: "Comment Entered: " + issue.projectKey,
                            comment: comment.description,
                            user: getUser(),
                            issue: issue))
        }
        response.status = 201
        response
    }
}
