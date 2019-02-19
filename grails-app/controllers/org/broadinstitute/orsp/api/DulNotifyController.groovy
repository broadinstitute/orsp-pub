package org.broadinstitute.orsp.api

import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.NotifyArguments
import org.broadinstitute.orsp.User

@Slf4j
class DulNotifyController extends AuthenticatedController{

    def sendNotifications() {
        User user = userService.findUser(request.JSON['userName'].toString())
        def issue = queryService.findByKey(params.consentKey)
        def usersNotif = [request.JSON['recipients']]
//        def dulLinksForm = method.getLinks()

        usersNotif.each {
            notifyService.sendDulFormLinkNotification(
                    new NotifyArguments(
                            toAddresses: [it.toString()],
                            subject: "New Data Use Letter form " + params.consentKey,
                            issue: issue,
                            user: user,
                            details: 'link-XXXXXXX-formlink'
                    )
            )
        }
        response.status = 200
        render (['sended': 'ok'] as JSON)
    }
}
