package org.broadinstitute.orsp

import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest

import static org.junit.Assert.assertTrue

class PersistenceServiceSpec extends BaseSpec implements ServiceUnitTest<PersistenceService>, DataTest {

    void setupSpec() {
        mockDomain Event
        mockDomain Comment
    }

    void testSaveEvent() {
        when:
        Event event = service.saveEvent("key", "author", "summary", null)

        then:
        assertTrue(event != null)
    }

    void testSaveComment() {
        when:
        Comment comment = service.saveComment("key", "author", "description")

        then:
        assertTrue(comment != null)
    }

}
