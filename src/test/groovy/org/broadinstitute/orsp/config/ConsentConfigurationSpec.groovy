package org.broadinstitute.orsp.config

import grails.testing.services.ServiceUnitTest
import org.broadinstitute.orsp.ConsentService
import spock.lang.Specification

class ConsentConfigurationSpec extends Specification implements ServiceUnitTest<ConsentService> {

    Closure doWithSpring() {{ ->
        consentConfiguration(ConsentConfiguration)
    }}

    void "test consent config"() {
        given:
        ConsentConfiguration config = service.consentConfiguration

        expect:
        !config.username.isEmpty()
        !config.password.isEmpty()
        !config.url.isEmpty()
        !config.statusUrl.isEmpty()
        !config.ontologyUrl.isEmpty()
        !config.ontologyStatusUrl.isEmpty()
    }

}
