package org.broadinstitute.orsp.api

import com.google.gson.JsonParser
import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.CollectionLinkStatus
import org.broadinstitute.orsp.ConsentCollectionLink
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.User
import org.broadinstitute.orsp.utils.IssueUtils
import org.springframework.web.multipart.MultipartFile

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class SampleConsentLinkController extends AuthenticatedController {

    def pages() {
        render(view: "/linkWizard/index", model: [projectKey: params.projectKey])
    }

    def save() {
        JsonParser parser = new JsonParser()
        User user = getUser()
        log.info(request.parameterMap["dataConsentCollection"].toString())
        ConsentCollectionLink consentCollectionLink = IssueUtils.getJson(ConsentCollectionLink.class, parser.parse(request.parameterMap["dataConsentCollection"].toString())[0])
        log.info(consentCollectionLink.projectKey)
        try {
            log.info("----------------------------------- 001 -------------------------");
            consentCollectionLink.creationDate = new Date()
            log.info("----------------------------------- 002 -------------------------");
            List<MultipartFile> files = request.multiFileMap.collect { it.value }.flatten()
            log.info("----------------------------------- 003 -------------------------");
            consentCollectionLink.status = queryService.areLinksApproved(consentCollectionLink.projectKey, consentCollectionLink.consentKey) ? CollectionLinkStatus.APPROVED.name : CollectionLinkStatus.PENDING.name
            log.info("----------------------------------- 004 -------------------------");
            persistenceService.saveConsentCollectionLink(consentCollectionLink)
            log.info("----------------------------------- 005 -------------------------");
            notifyService.sendAddedCGToProjectNotification(consentCollectionLink.consentKey, consentCollectionLink.projectKey)
            log.info("----------------------------------- 006 -------------------------");
            if (!files?.isEmpty()) {
                log.info("----------------------------------- 007 files -------------------------");
                files.forEach {
                    storageProviderService.saveMultipartFile(user.displayName, user.userName, consentCollectionLink?.consentKey, it.name, it, consentCollectionLink)
                }
            }
            log.info("----------------------------------- 008 -------------------------");
            response.status = 201
            log.info("----------------------------------- 009 -------------------------");
            render([message: consentCollectionLink] as JSON)
        } catch (Exception e) {
            log.info("----------------------------------- 010 ------------------------- " + e.getLocalizedMessage());
            e.printStackTrace()
            persistenceService.deleteCollectionLink(consentCollectionLink)
            log.info("----------------------------------- 011 -------------------------");
            handleException(e)
        }
    }
}
