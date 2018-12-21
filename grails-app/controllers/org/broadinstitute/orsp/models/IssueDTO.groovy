package org.broadinstitute.orsp.models

import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueStatus

class IssueDTO {

    String type
    String status
    String summary
    String studyDescription
    String reporter

    static constraints = {
        type blank: true, nullable: true
        status blank: true, nullable: true
        summary blank: true, nullable: true
        studyDescription blank: true, nullable: true
        reporter blank: true, nullable: true
    }


    Issue getIssue (type, user) {
        return new Issue(
                type: type,
                status: IssueStatus.Open.name,
                summary: this.summary,
                description: this.studyDescription,
                reporter: user,
                expirationDate: null,
                requestDate: new Date(),
                updateDate: new Date()
        )
    }
}
