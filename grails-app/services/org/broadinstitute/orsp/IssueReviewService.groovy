package org.broadinstitute.orsp

class IssueReviewService {
    IssueReview create(IssueReview issueReview) throws DomainException {
        issueReview.save(flush: true)
        issueReview
    }

    void delete(String projectKey) throws DomainException {
        IssueReview ir = findByProjectKey(projectKey)
        ir.delete(flush: true)
    }

    static IssueReview findByProjectKey(String projectKey) {
        return IssueReview.findByProjectKey(projectKey)
    }

}
