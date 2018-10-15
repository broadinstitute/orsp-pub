package org.broadinstitute.orsp.domain

import grails.testing.gorm.DomainUnitTest
import org.broadinstitute.orsp.BaseSpec
import org.broadinstitute.orsp.ChecklistAnswer

class ChecklistAnswerSpec extends BaseSpec implements DomainUnitTest<ChecklistAnswer> {

    void testValid() {
        given:
        ChecklistAnswer checklistAnswer = new ChecklistAnswer(
                questionId: "ID",
                projectKey: "OD-12345",
                value: "Value",
                updateDate: new Date(),
                reviewer: "Reviewer"
        )

        when:
        def valid = checklistAnswer.validate()

        then:
        valid
    }

    void testInvalid() {
        given:
        ChecklistAnswer checklistAnswer = new ChecklistAnswer()

        when:
        def valid = checklistAnswer.validate()

        then:
        !valid
    }

}
