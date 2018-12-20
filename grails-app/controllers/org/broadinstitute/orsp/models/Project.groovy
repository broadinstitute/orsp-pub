package org.broadinstitute.orsp.models

import org.broadinstitute.orsp.Funding
import org.broadinstitute.orsp.FundingFields
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueType

class Project {

    String type
    String status
    String summary
    String studyDescription
    String reporter
    String pTitle
    String pi
    String pm
    Date requestDate
    List<Object> fundings
    List<Object> questions
    String protocol
    List<Object> collaborators
    Boolean subjectProtection

    static constraints = {
        type blank: true, nullable: true
        status blank: true, nullable: true
        summary blank: true, nullable: true
        studyDescription blank: true, nullable: true
        reporter blank: true, nullable: true
        pTitle blank: true, nullable: true
        pi blank: true, nullable: true
        pm blank: true, nullable: true
        requestDate blank: true, nullable: true
        collaborators blank: true, nullable: true
        fundings blank: true, nullable: true
        studyDescription blank: true, nullable: true
        protocol blank: true, nullable: true
        questions nullable:false
        subjectProtection nullable:false
    }

    Issue getIssue () {
        IssueType type = IssueType.valueOfPrefix(this.type)
        return new Issue(
                type: type.name,
                status: this.status,
                summary: this.summary,
                description: this.studyDescription,
                reporter: this.reporter,
                expirationDate: null,
                requestDate: new Date(),
                updateDate: new Date()
        )
    }

    List<Funding> getFundingList(String projectKey) {
        return this.fundings?.collect { p ->
            Funding f = new Funding()
            f.setCreated(new Date())
            f.setSource(p.get(FundingFields.SOURCE.name)?.toString())
            f.setName(p.get(FundingFields.NAME.name)?.toString())
            f.setAwardNumber(p.get(FundingFields.AWARD_NUMBER.name)?.toString())
            f.setProjectKey(projectKey)
            f
        }
    }
}
