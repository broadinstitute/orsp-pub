package org.broadinstitute.orsp.config

import grails.testing.services.ServiceUnitTest
import org.broadinstitute.orsp.SwaggerService
import spock.lang.Specification

class AppInfoConfigurationSpec extends Specification implements ServiceUnitTest<SwaggerService> {

    Closure doWithSpring() {{ ->
        appInfoConfiguration(AppInfoConfiguration)
    }}

    void "test app info config"() {
        given:
        AppInfoConfiguration config = service.appInfoConfiguration

        expect:
        !config.name.isEmpty()
        !config.version.isEmpty()
        !config.grailsVersion.isEmpty()
    }

}
