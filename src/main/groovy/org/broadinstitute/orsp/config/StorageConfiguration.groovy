package org.broadinstitute.orsp.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "storage")
class StorageConfiguration {
    String config
    String url
    String bucket
}
