package org.broadinstitute.orsp

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class CommentsController extends AuthenticatedController {

    def index = { list }


    def list = {
        Issue issue = queryService.findByKey(params.id)
        Collection<Comment> comments = Comment.findAllByProjectKey(params.id)
        [issue: issue, comments: comments]
    }

    def saveNewComment() {
        try {
            Comment savedComment = addComment(params.id, params.comment)
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
        JSON.registerObjectMarshaller(Comment) {
            def output = [:]
            output['id'] = it.id
            output['author'] = it.author
            output['comment'] = it.description
            output['date'] = it.created
            return output
        }
        try {
            Collection<Comment> comments = getCommentsForIssueId(params.id)
            response.status = 200
            render comments as JSON
        } catch(IllegalArgumentException e) {
            response.status = 400
            render([error: e.message] as JSON)
        } catch(Error e) {
            response.status = 500
            render([error: e.message] as JSON)
        }
    }
}
