package org.broadinstitute.orsp

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.utils.IssueUtils
import org.broadinstitute.orsp.utils.UtilityClass

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class CommentsController extends AuthenticatedController {

    CommentsService commentsService
    QueryService queryService

    def index = { list }

    @Deprecated
    def list = {
        Issue issue = queryService.findByKey(params.id)
        Collection<Comment> comments = Comment.findAllByProjectKey(params.id)
        [issue: issue, comments: comments]
    }

    def saveNewComment() {
        try {
            Comment savedComment = commentsService.addComment(params.id, request.JSON.getAt('comment').toString())
            response.status = 200
            render savedComment as JSON
        } catch (IllegalArgumentException e) {
            response.status = 400
            render([error: e.message] as JSON)
        } catch (Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }
    }

    def getComments() {
        UtilityClass.registerCommentMarshaller()
        try {
            Collection<Comment> comments = commentsService.getCommentsForIssueId(params.id)
            response.status = 200
            render comments as JSON
        } catch(IllegalArgumentException e) {
            response.status = 400
            render([error: e.message] as JSON)
        } catch(Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }
    }

    def deleteComment() {
        Map<String, Object> commentId = IssueUtils.getJson(Map.class, request.JSON)
        Integer id = commentId.get('id')
        try {
            queryService.deleteCommentById(id)
            response.status = 200
        } catch (Exception e) {
            handleException(e)
        }
    }

    def updateComment() {
        Map<String, Object> editedCommentData = IssueUtils.getJson(Map.class, request.JSON)
        String id = editedCommentData.get('id').toString()
        String comment = editedCommentData.get('comment')
        String author = editedCommentData.get('author')
        try {
            queryService.updateCommentById(id, comment, author)
            response.status = 200
        } catch (Exception e) {
            handleException(e)
        }
    }
}
