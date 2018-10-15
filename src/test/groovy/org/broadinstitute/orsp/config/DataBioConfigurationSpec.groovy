package org.broadinstitute.orsp.config

import grails.testing.services.ServiceUnitTest
import org.broadinstitute.orsp.webservice.DataBioOntologyService
import spock.lang.Specification

class DataBioConfigurationSpec extends Specification implements ServiceUnitTest<DataBioOntologyService> {

    Closure doWithSpring() {{ ->
        dataBioConfiguration(DataBioConfiguration)
    }}

    void "test data bio config"() {
        given:
        DataBioConfiguration config = service.dataBioConfiguration

        expect:
        !config.searchUrl.isEmpty()
        !config.classUrl.isEmpty()
        !config.statusUrl.isEmpty()
        !config.apiKey.isEmpty()
    }

}
