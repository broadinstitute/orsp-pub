package org.broadinstitute.orsp.models

import org.broadinstitute.orsp.Funding
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueExtraProperty

class Project {

    String type
    String status
    String summary
    String studyDescription
    String reporter
    String pTitle
    String piName
    String projectmanager
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
        studyDescription nullable:true
        reporter nullable:true
        pTitle nullable:true
        piName nullable:true
        projectmanager nullable:true
        requestDate nullable:true
        collaborators nullable:true
        fundings nullable:true
        studyDescription nullable:true
        irbProtocolId nullable:true
        questions nullable:true
        subjectProtection nullable:true
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
        return fundings.collect { p ->
            Funding f = new Funding()

            f.setCreated(new Date())
            f.setSource(p.get("source").toString())
            f.setName(p.get("sponsor").toString())
            f.setAwardNumber(p.get("identifier").toString())
            f.setProjectKey(projectKey)
            f
        }
    }
}
