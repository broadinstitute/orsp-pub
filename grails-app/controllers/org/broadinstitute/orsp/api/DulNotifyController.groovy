package org.broadinstitute.orsp.api

import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.NotifyArguments
import org.broadinstitute.orsp.User

@Slf4j
class DulNotifyController extends AuthenticatedController{

    def sendNotifications() {
        User user = userService.findUser('triveros')
        // TODO pedir los links de cada formulario antes de enviar el email

        println 'notify'
        println request.JSON['projectKey']
        def issue = queryService.findByKey(params.id)
        def usersNotif = ['lforcone@broadinstitute','triveros@broadinstitute.org' ]
        def dulLinksForm = method.getLinks()

        usersNotif.each {

            notifyService.sendDulFormLinkNotification(
                    new NotifyArguments(
                            toAddresses: [it.toString()],
                            subject: "New Data Use Letter form" + request.JSON['projectKey'],
                            issue: issue,
                            user: user,
                            details: 'link'
                    )
            )
        }
        render (['ok': 'ok'] as JSON)
    }
}
