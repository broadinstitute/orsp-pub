package org.broadinstitute.orsp.domain

import grails.testing.gorm.DomainUnitTest
import org.broadinstitute.orsp.BaseSpec
import org.broadinstitute.orsp.DataUseRestriction

class DataUseRestrictionSpec extends BaseSpec implements DomainUnitTest<DataUseRestriction> {

    void testValid() {
        given:
        DataUseRestriction restriction = new DataUseRestriction(
                consentGroupKey: "OD-TEST",
                consentPIName: "Test",
                generalUse: false
        )

        when:
        def valid = restriction.validate()

        then:
        valid
    }

    void testInvalid() {
        given:
        DataUseRestriction restriction = new DataUseRestriction(
                consentGroupKey: "OD-TEST",
                consentPIName: "Test",
                generalUse: null
        )

        when:
        def valid = restriction.validate()

        then:
        !valid
    }

}
