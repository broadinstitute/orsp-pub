package org.broadinstitute.orsp.domain

import grails.testing.gorm.DomainUnitTest
import org.broadinstitute.orsp.BaseSpec
import org.broadinstitute.orsp.ConsentCollectionLink

class ConsentCollectionLinkSpec extends BaseSpec implements DomainUnitTest<ConsentCollectionLink> {

    void testValid() {
        given:
        ConsentCollectionLink link = new ConsentCollectionLink(
                projectKey: "OD-TEST",
                consentKey: "OD-TEST",
                sampleCollectionId: "SC-TEST",
                creationDate: new Date()
        )

        when:
        def valid = link.validate()

        then:
        valid
    }

    void testInvalid() {
        given:
        ConsentCollectionLink link = new ConsentCollectionLink()

        when:
        def valid = link.validate()

        then:
        !valid
    }

}
