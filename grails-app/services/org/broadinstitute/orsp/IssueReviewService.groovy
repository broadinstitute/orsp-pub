package org.broadinstitute.orsp

import com.google.gson.Gson
import grails.converters.JSON
import grails.gorm.transactions.Transactional

class IssueReviewService {

    NotifyService notifyService

    @Transactional
    IssueReview create(IssueReview issueReview) throws DomainException {
        issueReview.save(flush: true)
        notifyService.sendEditsSubmissionNotification(Issue.findByProjectKey(issueReview.projectKey))
        issueReview
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

}
