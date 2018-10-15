package org.broadinstitute.orsp.config

import grails.testing.services.ServiceUnitTest
import org.broadinstitute.orsp.StorageProviderService
import spock.lang.Specification

class StorageConfigurationSpec extends Specification implements ServiceUnitTest<StorageProviderService> {

    Closure doWithSpring() {{ ->
        storageConfiguration(StorageConfiguration)
    }}

    void "test storage config"() {
        given:
        StorageConfiguration config = service.storageConfiguration

        expect:
        !config.config.isEmpty()
        !config.url.isEmpty()
        !config.bucket.isEmpty()
    }

}
