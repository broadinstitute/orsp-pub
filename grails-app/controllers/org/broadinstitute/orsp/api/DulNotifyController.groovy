package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.web.mapping.LinkGenerator
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.DataUseLetter
import org.broadinstitute.orsp.DataUseLetterService
import org.broadinstitute.orsp.EventType
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.NotifyArguments
import org.broadinstitute.orsp.User
import org.broadinstitute.orsp.dataUseLetter.DataUseLetterFields

import javax.annotation.Resource

@Slf4j
@Resource
class DulNotifyController extends AuthenticatedController{

    LinkGenerator grailsLinkGenerator
    DataUseLetterService dataUseLetterService

    def sendNotifications() {
        User user = userService.findUser(request.JSON['userName'].toString())
        Issue issue = queryService.findByKey(params.consentKey)
        def usersNotif = [request.JSON['recipients']]
        DataUseLetter dataUseLetter = new DataUseLetter()
        dataUseLetter.setConsentGroupKey(issue.projectKey)
        dataUseLetter.setCreator(user.userName)
        String uuid = dataUseLetterService.generateDul(dataUseLetter)[DataUseLetterFields.UID.abbreviation]
        String urlFormDul = grailsLinkGenerator.getServerBaseURL() + "/dataUseLetter/show?id=" + uuid

        usersNotif.each {
            notifyService.sendDulFormLinkNotification(
                    new NotifyArguments(
                            toAddresses: [it.toString()],
                            subject: "New Data Use Letter form " + params.consentKey,
                            issue: issue,
                            user: user,
                            details: urlFormDul
                    )
            )
        }
        persistenceService.saveEvent(issue.projectKey, getUser()?.displayName, "DUL linked by email", EventType.SEND_DUL_LINK_BY_EMAIL)
        response.status = 200
        render (['sended': 'ok'] as JSON)
    }
}
