package org.broadinstitute.orsp

class IssueReview {

    Long id
    String projectKey
    String suggestions
//    String reviewer

    static constraints = {
        projectKey nullable: false
        suggestions nullable: false
    }

}
