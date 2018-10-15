package org.broadinstitute.orsp.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "bsp")
class BspConfiguration {
    Boolean sync
    BspServiceConfiguration service
}

class BspServiceConfiguration {
    String username
    String password
    String allSampleCollectionsUrl
    String statusUrl
}