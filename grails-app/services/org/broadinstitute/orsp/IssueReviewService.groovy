package org.broadinstitute.orsp

class IssueReviewService {
    IssueReview create(IssueReview issueReview) throws DomainException {
        issueReview.save(flush: true)
        issueReview
    }

    void delete(String projectKey) throws DomainException {
        IssueReview ir = findByProjectKey(projectKey)
        if (ir != null) {
            ir.delete(flush: true)
        }

    }

    IssueReview findByProjectKey(String projectKey) {
        return IssueReview.findByProjectKey(projectKey)
    }

}
