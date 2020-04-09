package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional

class IssueReviewService {

    NotifyService notifyService

    @Transactional
    IssueReview create(IssueReview issueReview, User user) throws DomainException {
        issueReview.save(flush: true)
        notifyService.sendEditsSubmissionNotification(Issue.findByProjectKey(issueReview.projectKey), user)
        issueReview
    }

    @Transactional
    void delete(String projectKey, String type) throws DomainException {
        IssueReview ir = findByProjectKey(projectKey)
        if (ir != null) {
            ir.delete(flush: true)
        }
        if (type == 'reject') {
            notifyService.sendEditsDisapprovedNotification(Issue.findByProjectKey(ir.projectKey), ir.getEditCreatorName())
        }
    }

    IssueReview findByProjectKey(String projectKey) {
        return IssueReview.findByProjectKey(projectKey)
    }

}
