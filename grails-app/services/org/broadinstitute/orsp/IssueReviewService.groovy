package org.broadinstitute.orsp

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
    void delete(String projectKey) throws DomainException {
        IssueReview ir = findByProjectKey(projectKey)
        if (ir != null) {
            ir.delete(flush: true)
        }
        notifyService.sendEditsDisapprovedNotification(Issue.findByProjectKey(ir.projectKey))
    }

    IssueReview findByProjectKey(String projectKey) {
        return IssueReview.findByProjectKey(projectKey)
    }

}
