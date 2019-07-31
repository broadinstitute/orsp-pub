package org.broadinstitute.orsp.config

import grails.testing.services.ServiceUnitTest
import org.broadinstitute.orsp.CrowdService
import spock.lang.Specification

class CrowdConfigurationSpec extends Specification implements ServiceUnitTest<CrowdService> {

    Closure doWithSpring() {{ ->
        crowdConfiguration(CrowdConfiguration)
    }}

    void "test crowd config"() {
        given:
        CrowdConfiguration config = service.crowdConfiguration

        expect:
        !config.url.isEmpty()
        !config.username.isEmpty()
        !config.password.isEmpty()
        config.interval > 0
        config.range > 0
    }

}
