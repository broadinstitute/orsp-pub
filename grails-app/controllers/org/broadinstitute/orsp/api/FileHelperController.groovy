package org.broadinstitute.orsp.api

import com.google.gson.Gson
import com.google.gson.JsonArray
import com.google.gson.JsonElement
import com.google.gson.JsonParser
import grails.converters.JSON
import grails.rest.Resource
import org.apache.commons.collections.CollectionUtils
import org.apache.commons.fileupload.disk.DiskFileItem
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.ConsentCollectionLink
import org.broadinstitute.orsp.ConsentService
import org.broadinstitute.orsp.DocumentStatus
import org.broadinstitute.orsp.EventType
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.PersistenceService
import org.broadinstitute.orsp.QueryService
import org.broadinstitute.orsp.StorageDocument
import org.broadinstitute.orsp.utils.IssueUtils
import org.springframework.web.multipart.MultipartFile


@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class FileHelperController extends AuthenticatedController{

    ConsentService consentService
    QueryService queryService
    PersistenceService persistenceService

    def attachDocument() {
        JsonParser parser = new JsonParser()
        JsonElement jsonFileDescription = parser.parse(request?.parameterMap["fileData"].toString())
        JsonArray fileData

        if (jsonFileDescription.jsonArray) {
            fileData = jsonFileDescription.asJsonArray
        }

        List<MultipartFile> files = request.multiFileMap.collect { it.value }.flatten()

        def names = []

        def issue = queryService.findByKey(params.id)
        try {
            files.forEach {
                names.push(it.name)
                if (!files.empty) {
                    StorageDocument document = new StorageDocument(
                            projectKey: issue.projectKey,
                            fileName: it.originalFilename,
                            fileType: it.name,
                            mimeType: it.contentType,
                            uuid: UUID.randomUUID().toString(),
                            creator: params.displayName,
                            username: params.userName,
                            creationDate: new Date(),
                            status: DocumentStatus.PENDING.status,
                            description: fileData.find {data -> data.fileName.value == it.originalFilename }.fileDescription.value
                    )
                    storageProviderService.saveStorageDocument(document, it.getInputStream())
                    persistenceService.saveEvent(issue.projectKey, getUser()?.displayName, "Document Added", EventType.UPLOAD_DOCUMENT)
                    transitionService.handleIntake(queryService.findByKey(params.id), [])
                }
            }
            render(['id': issue.projectKey, 'files': names] as JSON)
        } catch (Exception e) {
            if (params.isNewIssue.toBoolean()) {
                issueService.deleteIssue(issue.projectKey)
                deleteDocuments(issue)
            }
            handleException(e)
        }
    }

    def rejectDocument() {
        StorageDocument document = StorageDocument.findByUuid(params.uuid)
        Issue issue = queryService.findByKey(document.projectKey)
        try {
            if (document != null) {
                document.setStatus(DocumentStatus.REJECTED.status)
                document.save(flush: true)
                persistenceService.saveEvent(document.projectKey, getUser()?.displayName, "Document Rejected", EventType.REJECT_DOCUMENT)
                render(['document': document] as JSON)
            } else {
                handleNotFound('Document not found')
            }
            transitionService.handleIntake(issue, [])
        } catch (Exception e) {
            handleException(e)
        }
    }

    def approveDocument() {
        StorageDocument document = StorageDocument.findByUuid(params.uuid)
        Issue issue = queryService.findByKey(document.projectKey)
        try {
            if (document != null) {
                document.setStatus(DocumentStatus.APPROVED.status)
                document.save(flush: true)
                persistenceService.saveEvent(document.projectKey, getUser()?.displayName, "Document Approved", EventType.APPROVE_DOCUMENT)
                render(['document': document] as JSON)
            } else {
                handleNotFound('Document not found')
            }
            transitionService.handleIntake(issue, [])
        } catch (Exception e) {
            handleException(e)
        }

    }

    def attachedDocuments() {
        Issue issue = queryService.findByKey(params.issueKey)
        if (issue != null) {
            Collection<ConsentCollectionLink> collectionLinks = queryService.findCollectionLinksByConsentKey(params.issueKey)
            List<Long> collectionIds = collectionLinks?.collect{it.id}
            // set all documents related to the specified key
            List<StorageDocument> documents = queryService.getAttachmentsForProject(params.issueKey)
            Boolean collectionDocsApproved = true
            if (CollectionUtils.isNotEmpty(collectionIds)) {
                collectionDocsApproved = consentService.collectionDocumentsApproved(collectionIds)
            }
            List<StorageDocument> results = storageProviderService.processStorageDocuments(documents)
            Gson gson = new Gson()
            String doc = gson.toJson(results)
            render ([documents : doc, attachmentsApproved: issue.attachmentsApproved() && collectionDocsApproved] as JSON)
        } else {
            handleNotFound('Project not found')
        }
    }

    def updateDocumentsVersion() {
        storageProviderService.updateSingleDocVersionType()
        response.status = 200
        render (['message': 'documents versions updated'] as JSON)
    }


    def deleteDocument() {
        storageProviderService.deleteDocument(Long.valueOf(params.documentId))
        response.status = 200
        render (['message': 'document deleted'] as JSON)
    }

    def getDocument() {
        StorageDocument document = StorageDocument.findById(params.id)
        render (['document': document] as JSON)
    }


    private void deleteDocuments(Issue issue) {
        Collection<StorageDocument> documents = queryService.getDocumentsForProject(issue.projectKey)
        if (documents != null) {
            documents.forEach {
                storageProviderService.removeStorageDocument(it, getUser()?.userName)
            }
        }
    }

    def deleteDocumentByUuid() {
        if (params.uuid) {
            try {
                StorageDocument document = queryService.findAttachmentByUuid(params.uuid)
                if (document) {
                    storageProviderService.removeStorageDocument(document, getUser()?.displayName)
                    response.status = 200
                    render(['message': 'document deleted'] as JSON)
                } else {
                    handleNotFound("Error trying to delete File. Document with Uuid: ${params.uuid} not found.")
                }
            } catch(Exception e) {
                log.error("Error trying to delete file with Uuid: ${params.uuid}.", e.getMessage())
                handleException(e)
            }
        } else {
            log.error("Error, document to delete has an empty UuId.")
            response.status = 400
            render(['message': 'Unable to delete a file with no Id.'] as JSON)
        }
    }

}
