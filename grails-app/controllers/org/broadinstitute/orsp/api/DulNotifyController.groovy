package org.broadinstitute.orsp.api

import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.NotifyArguments

@Slf4j
class DulNotifyController extends AuthenticatedController{

    def sendNotifications() {
        println 'notify'
        notifyService.s
        println request.JSON['projectKey']
        notifyService.sendDulFormLinkNotification(
                new NotifyArguments(
                        toAddresses: ["triveros@broadinstitute.org"],
                        subject: "New Data Use Letter form" + issue.projectKey,
                        issue: issue,
                        user: getUser(),
                        comment: params.comment
                )
        )
        render (['ok': 'ok'] as JSON)
    }
}
