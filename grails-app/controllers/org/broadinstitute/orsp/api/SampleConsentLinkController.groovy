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
import org.broadinstitute.orsp.DataLocations
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.StorageDocument
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
        JsonSlurper slurper = new JsonSlurper()
        List<DataLocations> dataLocations = slurper.parseText(request.parameterMap["dataLocations"].toString())
        dataLocations = dataLocations[0]
        JsonElement jsonFile = parser.parse(request?.parameterMap["fileData"].toString())
        JsonArray fileData
        if (jsonFile.jsonArray) {
            fileData = jsonFile.asJsonArray
        }
        try {
            consentCollectionLink.creationDate = new Date()
            consentCollectionLink.questionnaireVersion = "v2"
            List<MultipartFile> files = request.multiFileMap.collect { it.value }.flatten()
            consentCollectionLink.status = queryService.areLinksApproved(consentCollectionLink.projectKey, consentCollectionLink.consentKey) ? CollectionLinkStatus.APPROVED.name : CollectionLinkStatus.PENDING.name
            persistenceService.saveConsentCollectionLink(consentCollectionLink)
            Boolean notifyableDatalocationsFound = false
            dataLocations.each {
                notifyableDatalocationsFound = ["Google Drive", "Google Cloud storage assets (e.g. Cloud Storage; BigQuery)", "On prem storage", "Broad-issued laptop", "Other"]
                        .any { item -> if(it.dataStores) it.dataStores.contains(item) }
                def dataLocation = new DataLocations(
                        researchStage: it.researchStage,
                        dataStores: it.dataStores,
                        terraUrl: it.terraUrl,
                        gcsaUrl: it.gcsaUrl,
                        gdriveUrl: it.gdriveUrl,
                        onpremUrl: it.onpremUrl,
                        bilCluster: it.bilCluster,
                        otherText: it.otherText
                )
                dataLocation.consentCollectionLink = consentCollectionLink
                dataLocation.save(flush: true)
            }
            notifyService.sendAddedCGToProjectNotification(consentCollectionLink.consentKey, consentCollectionLink.projectKey, consentCollectionLink, user.displayName, notifyableDatalocationsFound)
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

    def updateConsentGroup() {
        JsonParser parser = new JsonParser()
        User user = getUser()
        ConsentCollectionLink consentCollectionLink = IssueUtils.getJson(ConsentCollectionLink.class, parser.parse(request.parameterMap["securityInfoData"].toString())[0])
        JsonSlurper slurper = new JsonSlurper()
        List<DataLocations> dataLocations = slurper.parseText(request.parameterMap["dataLocations"].toString())
        dataLocations = dataLocations[0]
        JsonElement jsonFile = parser.parse(request?.parameterMap["fileData"].toString())
        JsonArray fileData
        if (jsonFile.jsonArray) {
            fileData = jsonFile.asJsonArray
        }
        try {
            List<MultipartFile> files = request.multiFileMap.collect { it.value }.flatten()
            consentCollectionLink.status = queryService.areLinksApproved(consentCollectionLink.projectKey, consentCollectionLink.consentKey) ? CollectionLinkStatus.APPROVED.name : CollectionLinkStatus.PENDING.name
            consentCollectionLink.questionnaireVersion = "v2";
            persistenceService.updateConsentCollectionLink(consentCollectionLink)
            dataLocations.each {
                DataLocations existingDataLocations = DataLocations.findById(it.id)
                if (existingDataLocations) {
                    existingDataLocations.researchStage = it.researchStage
                    existingDataLocations.dataStores = it.dataStores
                    existingDataLocations.terraUrl = it.terraUrl
                    existingDataLocations.gcsaUrl = it.gcsaUrl
                    existingDataLocations.gdriveUrl = it.gdriveUrl
                    existingDataLocations.onpremUrl = it.onpremUrl
                    existingDataLocations.bilCluster = it.bilCluster
                    existingDataLocations.otherText = it.otherText
                    existingDataLocations.save(flush: true, failOnError: true)
                } else {
                    def dataLocation = new DataLocations(
                            researchStage: it.researchStage,
                            dataStores: it.dataStores,
                            terraUrl: it.terraUrl,
                            gcsaUrl: it.gcsaUrl,
                            gdriveUrl: it.gdriveUrl,
                            onpremUrl: it.onpremUrl,
                            bilCluster: it.bilCluster,
                            otherText: it.otherText
                    )
                    dataLocation.consentCollectionLink = consentCollectionLink
                    dataLocation.save(flush: true)
                }
            }
            StorageDocument doc = new StorageDocument()
            if (!files?.isEmpty()) {
                def docIdRef = queryService.getStorageDocUuid(consentCollectionLink.id.toString(), "Collaborator Approval")
                if (docIdRef.size()) {
                    long docId = docIdRef[0] as long
                    storageProviderService.deleteDocument(docId)
                }
                files.forEach {
                    String description = fileData.find {data -> data.fileName.value == it.originalFilename }.fileDescription.value
                    doc = storageProviderService.saveMultipartFile(user.displayName, user.userName, consentCollectionLink?.consentKey, it.name, it, consentCollectionLink, description)
                }
            }
            response.status = 200
            render([message: "Successfully updated", docId: doc.uuid] as JSON)
        } catch (Exception e) {
            log.error("There was an error trying to update consent group: " + e.message)
            handleException(e)
        }
    }

}
