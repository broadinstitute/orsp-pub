package org.broadinstitute.orsp

class CommentsController extends AuthenticatedController {

    def index = { list }

    def list = {
        Issue issue = queryService.findByKey(params.id)
        Collection<Comment> comments = Comment.findAllByProjectKey(params.id)
        [issue: issue, comments: comments]
    }

}
