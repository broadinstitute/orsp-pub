package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.Comment
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.NotifyArguments

import javax.ws.rs.core.Response

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

            // By default, comments should go to ORSP
            List<String> toAddresses = new ArrayList<>()
            toAddresses.addAll(notifyService.getOrspSpecialRecipients())
            String fromAddress = (String) getUser()?.emailAddress

            // If the user is ORSP/Admin, and there are PMs available, send the comment to the PMs.
            if (isAdmin() && !issue.getPMs().isEmpty()) {
                toAddresses?.clear()
                toAddresses.addAll(userService.findUsers(issue.getPMs())?.collect {it.emailAddress})
                fromAddress = notifyService.ORSP_ADDRESS
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
        String url = issue.controller + '/show/' + params.id + '?tab=comments'
        response.status = 201
        render([url: url] as JSON)
    }
}
