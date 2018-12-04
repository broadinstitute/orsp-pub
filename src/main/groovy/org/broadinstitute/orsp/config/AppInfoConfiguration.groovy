package org.broadinstitute.orsp.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "info.app")
class AppInfoConfiguration {
    String name
    String version
    String grailsVersion
}
