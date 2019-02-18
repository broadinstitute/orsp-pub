package org.broadinstitute.orsp.api

import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController

@Slf4j
class DulNotifyController extends AuthenticatedController{

    def sendNotifications() {
        println 'notify'
        notifyService.s
        println request.JSON['projectKey']
        render (['ok': 'ok'] as JSON)
    }
}
