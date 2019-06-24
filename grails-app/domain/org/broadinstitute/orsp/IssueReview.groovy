package org.broadinstitute.orsp

import grails.converters.JSON

class IssueReview {

    Long id
    String projectKey
    String suggestions

    static constraints = {
        projectKey nullable: false
        suggestions nullable: false
    }

    String getEditCreator() {
        return JSON.parse(this.suggestions).getAt(IssueExtraProperty.EDIT_CREATOR).toString()
    }
}
