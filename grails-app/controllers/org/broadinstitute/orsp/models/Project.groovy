package org.broadinstitute.orsp.models

import com.google.gson.Gson
import org.broadinstitute.orsp.Funding
import org.broadinstitute.orsp.Issue

class Project {

    String type
    String status
    String summary
    String studyDescription
    String reporter
    Date requestDate
    String piName
    String projectmanager
    List<String> collaboratorIds
    List<Object> fundings
    List<Object> questions

    String irbProtocolId

    static constraints = {
        type nullable:true
        status nullable:true
        reporter nullable:true
        requestDate nullable:true
        piName nullable:true
        projectmanager nullable:true
        collaboratorIds nullable:true
        fundings nullable:true
        studyDescription nullable:true
        summary nullable:true
        irbProtocolId nullable:true
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
            f.setName(p.get("name").toString())
            f.setAwardNumber(p.get("awardNumber").toString())
            f.setProjectKey(projectKey)
            f
        }

    }
}
