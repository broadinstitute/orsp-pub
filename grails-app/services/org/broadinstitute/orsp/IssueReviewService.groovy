package org.broadinstitute.orsp

import com.google.gson.Gson
import grails.converters.JSON
import grails.gorm.transactions.Transactional

class IssueReviewService {

    NotifyService notifyService

    @Transactional
    IssueReview create(IssueReview issueReview, User editCreator) throws DomainException {
        IssueReview issueReviewToSave = addEditCreatorToIssueReview(issueReview, editCreator)
        issueReviewToSave.save(flush: true)
        notifyService.sendEditsSubmissionNotification(Issue.findByProjectKey(issueReviewToSave.projectKey))
        issueReviewToSave
    }

    @Transactional
    void delete(String projectKey, String type) throws DomainException {
        IssueReview ir = findByProjectKey(projectKey)
        if (ir != null) {
            ir.delete(flush: true)
        }
        if (type == 'reject') {
            String editCreatorName = ir.getEditCreatorName()
            notifyService.sendEditsDisapprovedNotification(Issue.findByProjectKey(ir.projectKey), editCreatorName)
        }
    }

    IssueReview findByProjectKey(String projectKey) {
        return IssueReview.findByProjectKey(projectKey)
    }

    private static IssueReview addEditCreatorToIssueReview(IssueReview issueReview, User editCreator) {
        IssueReview issueReviewWithEditor = new IssueReview()
        issueReviewWithEditor.id = issueReview?.id
        issueReviewWithEditor.projectKey = issueReview?.projectKey
        Object suggestions = JSON.parse(issueReview?.getSuggestions())
        suggestions.putAt(IssueExtraProperty.EDIT_CREATOR, editCreator.getUserName())
        issueReviewWithEditor.suggestions = new Gson().toJson(suggestions)
        issueReviewWithEditor
    }
}
