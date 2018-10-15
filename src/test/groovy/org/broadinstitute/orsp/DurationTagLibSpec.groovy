package org.broadinstitute.orsp

import grails.testing.web.taglib.TagLibUnitTest
import spock.lang.Specification
import org.joda.time.Period

class DurationTagLibSpec extends Specification implements TagLibUnitTest<DurationTagLib> {

    void testFrom() {
        def appliedTemplate = applyTemplate('<duration:from date="${date}"/>', [date: new Date()])
        assert appliedTemplate == "0 days"
    }

    void testPeriod() {
        def appliedTemplate = applyTemplate('<duration:period period="${period}"/>', [period: new Period(1000000)])
        assert appliedTemplate == "16 minutes and 40 seconds"
    }

}
