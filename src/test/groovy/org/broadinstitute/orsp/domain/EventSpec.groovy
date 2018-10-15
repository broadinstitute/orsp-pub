package org.broadinstitute.orsp.domain

import grails.testing.gorm.DomainUnitTest
import org.broadinstitute.orsp.BaseSpec
import org.broadinstitute.orsp.Event

class EventSpec extends BaseSpec implements DomainUnitTest<Event> {

    void testInvalid() {
        given:
        def event = new Event()

        when:
        def valid = event.validate()

        then:
        !valid
    }

    void testValid() {
        given:
        def event = new Event(
                author: "test",
                created: new Date(),
                projectKey: "test",
                summary: "test"
        )

        when:
        def valid = event.validate()

        then:
        valid
    }

}
