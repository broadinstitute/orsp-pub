package org.broadinstitute.orsp

class IssueReviewService {



    IssueReview create(IssueReview issueReview) throws DomainException {
        issueReview.save(flush: true)
    }


    IssueReview update(IssueReview issueReview) throws DomainException {

    }


    void delete(String projectKey) throws DomainException {
        //TODO
    }

    IssueReview findByProjectKey(String projectKey) {

    }

}
