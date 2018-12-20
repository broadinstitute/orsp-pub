package org.broadinstitute.orsp.models

import org.broadinstitute.orsp.Funding
import org.broadinstitute.orsp.FundingFields
import org.broadinstitute.orsp.Issue

class Project {

    String type
    String status
    String summary
    String studyDescription
    String reporter
    String pTitle
    String piName
    String projectManager
    Date requestDate
    List<Object> fundings
    List<Object> questions
    String irbProtocolId
    List<Object> collaborators
    Boolean subjectProtection

    static constraints = {
        type nullable:true
        status nullable:true
        summary nullable:true
        studyDescription nullable:false
        reporter nullable:true
        pTitle nullable:false
        piName nullable:true
        projectManager nullable:true
        requestDate nullable:true
        collaborators nullable:true
        fundings nullable:false
        studyDescription nullable:true
        irbProtocolId nullable:true
        questions nullable:false
        subjectProtection nullable:false
    }

    Issue getIssue () {
        return new Issue(
                type: this.type,
                status: this.status,
                summary: this.summary,
                description: this.studyDescription,
                reporter: this.reporter,
                expirationDate: null,
                requestDate: new Date()
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
