package org.broadinstitute.orsp

import groovy.util.logging.Slf4j

@Slf4j
class CommentsService implements UserInfo {
    QueryService queryService
    PersistenceService persistenceService
    NotifyService notifyService
    UserService userService

    /**
     * @param issueId  Project or Sample Data Cohort element to associate comments
     * @param commentToSave  Comment's String
     * @return  If the comment has been successfully saved, it will return the saved comment
     * @throws IllegalArgumentException  A null comment can't be saved
     */
    Comment addComment(String issueId, String commentToSave) throws IllegalArgumentException{
        if (commentToSave) {
            Issue issue = queryService.findByKey(issueId)
            Comment comment = persistenceService.saveComment(issue.projectKey, getUser()?.displayName, commentToSave)

            if (comment == null) {
                log.error("Error saving comment for issue '" + issueId + "': null")
                throw new IllegalArgumentException("Error trying to save comment.")
            }
            if (comment.hasErrors()) {
                comment.errors.getAllErrors().each {
                    log.error("Error saving comment for issue '" + issueId + "': " + it)
                }
                throw new Exception("Error trying to save comment.")
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
            toAddresses.add(notifyService.getAdminRecipient())
            notifyService.sendComment(
                    new NotifyArguments(
                            toAddresses: toAddresses,
                            fromAddress: fromAddress,
                            subject: getUser().displayName " added a comment Entered: " + issue.projectKey,
                            comment: comment.description,
                            user: getUser(),
                            issue: issue))
            comment
        } else {
            throw new IllegalArgumentException("Empty comment to save")
        }
    }

    /**
     * @param issueId Project or Data Sample Cohort id
     * @return  Collection of Comments associated to the given issueId
     */
    Collection<Comment> getCommentsForIssueId(String issueId) throws IllegalArgumentException {
        Collection<Comment> comments = []
        if (issueId) {
            comments = queryService.getCommentsByIssueId(issueId)
        } else {
            log.error("Unable to get Comments from null issueId.")
            throw new IllegalArgumentException("Issue id is required.")
        }
        comments
    }
}
