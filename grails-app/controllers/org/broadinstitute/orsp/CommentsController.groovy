package org.broadinstitute.orsp

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.utils.UtilityClass

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class CommentsController extends AuthenticatedController {

    CommentsService commentsService

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
}
