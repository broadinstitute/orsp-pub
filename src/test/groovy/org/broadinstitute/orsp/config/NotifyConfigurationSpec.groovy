package org.broadinstitute.orsp.config

import grails.testing.services.ServiceUnitTest
import org.broadinstitute.orsp.NotifyService
import spock.lang.Specification

class NotifyConfigurationSpec extends Specification implements ServiceUnitTest<NotifyService> {

    Closure doWithSpring() {{ ->
        notifyConfiguration(NotifyConfiguration)
    }}

    void "test nofity config"() {
        given:
        NotifyConfiguration config = service.notifyConfiguration

        expect:
        !config.sendGridUrl.isEmpty()
        !config.apiKey.isEmpty()
        !config.fromAddress.isEmpty()
        !config.defaultRecipient.isEmpty()
        !config.orspSpecialRecipients.isEmpty()
        !config.bccRecipients.isEmpty()
        !config.replyToRecipient.isEmpty()
        !config.sendGridStatusUrl.isEmpty()
    }

}
