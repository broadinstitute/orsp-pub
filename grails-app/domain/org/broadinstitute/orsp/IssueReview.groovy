package org.broadinstitute.orsp

class IssueReview {

    Long id
    String projectKey
    String suggestions

    static constraints = {
        projectKey nullable: false
        suggestions nullable: false
    }

}
