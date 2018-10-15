package org.broadinstitute.orsp.domain

import grails.testing.gorm.DomainUnitTest
import org.broadinstitute.orsp.Submission
import org.broadinstitute.orsp.SubmissionType
import org.broadinstitute.orsp.BaseSpec

class SubmissionSpec extends BaseSpec implements DomainUnitTest<Submission> {

    void testValid() {
        given:
        Submission submission = new Submission(
                projectKey: "OD-TEST",
                author: "Test",
                createDate: new Date(),
                type: SubmissionType.Other.label,
                number: 1
        )

        when:
        def valid = submission.validate()
        submission.errors.allErrors.each { println it }

        then:
        valid
    }

    void testInvalid() {
        given:
        Submission submission = new Submission()

        when:
        def valid = submission.validate()

        then:
        !valid
    }

}
