package org.broadinstitute.orsp.config

import grails.testing.services.ServiceUnitTest
import org.broadinstitute.orsp.BspWebService
import spock.lang.Specification

class BspConfigurationSpec extends Specification implements ServiceUnitTest<BspWebService> {

    Closure doWithSpring() {{ ->
        bspConfiguration(BspConfiguration)
    }}

    void "test bsp config"() {
        given:
        BspConfiguration config = service.bspConfiguration

        expect:
        !config.sync
        !config.service.username.isEmpty()
        !config.service.password.isEmpty()
        !config.service.allSampleCollectionsUrl.isEmpty()
        !config.service.statusUrl.isEmpty()
    }

}
