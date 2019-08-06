package org.broadinstitute.orsp.config

import grails.testing.services.ServiceUnitTest
import org.broadinstitute.orsp.BQService
import spock.lang.Specification

class BQConfigurationSpec extends Specification implements ServiceUnitTest<BQService> {

    Closure doWithSpring() {{ ->
        bqConfiguration(BQConfiguration)
    }}

    void "test bigQuery config"() {
        given:
        BQConfiguration config = service.bqConfiguration

        expect:
        !config.config.isEmpty()
    }

}
