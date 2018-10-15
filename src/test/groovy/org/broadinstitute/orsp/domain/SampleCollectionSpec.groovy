package org.broadinstitute.orsp.domain

import grails.testing.gorm.DomainUnitTest
import org.broadinstitute.orsp.SampleCollection
import spock.lang.Specification

class SampleCollectionSpec extends Specification implements DomainUnitTest<SampleCollection> {

    def setup() {
    }

    def cleanup() {
    }

    void testInvalid() {
        given:
        def collection = new SampleCollection()

        when:
        def valid = collection.validate()

        then:
        !valid
    }

    void testValid() {
        given:
        def collection = new SampleCollection(
                collectionId: "test",
                name: "test"
        )

        when:
        def valid = collection.validate()

        then:
        valid
    }

}
