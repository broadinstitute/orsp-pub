package org.broadinstitute.orsp.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "consent.service")
class ConsentConfiguration {
    String username
    String password
    String url
    String statusUrl
    String ontologyUrl
    String ontologyStatusUrl
}
