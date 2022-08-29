package org.broadinstitute.orsp.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "notifyService")
class NotifyConfiguration {
    String sendGridUrl
    String apiKey
    String fromAddress
    String defaultRecipient
    List<String> orspSpecialRecipients
    List<String> bccRecipients
    String replyToRecipient
    String sendGridStatusUrl
    String adminRecipient
    String securityRecipient
    String agreementsRecipient
    String conflictOfInterestRecipient
}
