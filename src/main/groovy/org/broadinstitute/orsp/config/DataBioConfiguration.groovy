package org.broadinstitute.orsp.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "dataBio")
class DataBioConfiguration {
    String searchUrl
    String classUrl
    String statusUrl
    String apiKey
}
