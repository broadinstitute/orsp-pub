package org.broadinstitute.orsp.api

import com.google.gson.JsonArray
import com.google.gson.JsonElement
import com.google.gson.JsonParser
import grails.converters.JSON
import grails.rest.Resource
import groovy.json.JsonSlurper
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
        ConsentCollectionLink consentCollectionLink = IssueUtils.getJson(ConsentCollectionLink.class, parser.parse(request.parameterMap["dataConsentCollection"].toString())[0])
        JsonElement jsonFileDescription = parser.parse(request?.parameterMap["fileData"].toString())
        JsonArray fileData
        if (jsonFileDescription.jsonArray) {
            fileData = jsonFileDescription.asJsonArray
        }
        try {
            consentCollectionLink.creationDate = new Date()
            List<MultipartFile> files = request.multiFileMap.collect { it.value }.flatten()
            consentCollectionLink.status = queryService.areLinksApproved(consentCollectionLink.projectKey, consentCollectionLink.consentKey) ? CollectionLinkStatus.APPROVED.name : CollectionLinkStatus.PENDING.name
            persistenceService.saveConsentCollectionLink(consentCollectionLink)
            notifyService.sendAddedCGToProjectNotification(consentCollectionLink.consentKey, consentCollectionLink.projectKey, consentCollectionLink, user.displayName)
            Issue issue = Issue.findByProjectKey(consentCollectionLink.projectKey)
            if (!files?.isEmpty()) {
                files.forEach {
                    String description = fileData.find {data -> data.fileName.value == it.originalFilename }.fileDescription.value
                    storageProviderService.saveMultipartFile(user.displayName, user.userName, consentCollectionLink?.consentKey, it.name, it, consentCollectionLink, description)
                }
            }
            response.status = 201
            render([message: consentCollectionLink] as JSON)
        } catch (Exception e) {
            persistenceService.deleteCollectionLink(consentCollectionLink)
            handleException(e)
        }
    }
}
