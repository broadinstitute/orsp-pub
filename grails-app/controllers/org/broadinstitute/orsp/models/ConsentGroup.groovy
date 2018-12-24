package org.broadinstitute.orsp.models

import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueStatus
import org.broadinstitute.orsp.IssueType



/*
{
	"source": "DEV-NHSR-6",
        "summary": "test",
	"consent": "consent",
	"protocol": "protocol number",
	"collInst": "coll inst",
	"collContact": "coll contact",
	"reporter": "vvicario",
	"sampleCollections": [],
	"consentGroupDescription": "consent group escription",
	"startDate": "",
	"endDate": "",
	"onGoingProcess": "false",
	"institutionalSources": [{
		"name": "name 1",
		"country": "country 1"
	}, {
		"name": "name 2",
		"country": "country 1"
	}],
	"subjectProtection": true,
	"questions": [{
		"key": "q1",
		"answer": "true"
	}, {
		"key": "q2",
		"answer": "false"
	}]
}
 */
class ConsentGroup {

    String consent
    String protocol
    String collInst
    String collContact
    String source
    List<Object> sampleCollections
    String consentGroupDescription
    String startDate
    String endDate
    String ongoingProcess
    List<Object> institutionalSources
    String subjectProtection
    List<Object> questions
    String status
    String summary
    String studyDescription
    String reporter



    Issue getIssue () {
        return new Issue(
                type: IssueType.CONSENT_GROUP.name,
                status: IssueStatus.Open.name,
                summary: this.summary,
                description: this.studyDescription,
                reporter: reporter,
                expirationDate: null,
                requestDate: new Date(),
                updateDate: new Date()
        )
    }

}
