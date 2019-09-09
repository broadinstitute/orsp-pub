package org.broadinstitute.orsp.api

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import javassist.NotFoundException
import org.apache.commons.collections.CollectionUtils
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.ConsentCollectionLink
import org.broadinstitute.orsp.ConsentService
import org.broadinstitute.orsp.DocumentStatus
import org.broadinstitute.orsp.EventType
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.StorageDocument
import org.springframework.web.multipart.MultipartFile


@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class FileHelperController extends AuthenticatedController{

    ConsentService consentService

    def attachDocument() {
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
                            status: DocumentStatus.PENDING.status
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
            handleException(e, 500)
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
                handleException(new NotFoundException('Document not found'), 404)
            }
            transitionService.handleIntake(issue, [])
        } catch (Exception e) {
            handleException(e, 500)
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
                handleException(new NotFoundException('Document not found'), 404)
            }
            transitionService.handleIntake(issue, [])
        } catch (Exception e) {
            handleException(e, 500)
        }

    }

    def attachedDocuments() {
        Collection<ConsentCollectionLink> collectionLinks = queryService.findCollectionLinksByConsentKey(params.issueKey)
        List<Long> collectionIds = collectionLinks?.collect{it.id}
        Collection<StorageDocument> documents = queryService.getDocumentsForProject(params.issueKey)
        Boolean collectionDocsApproved = true
        if (CollectionUtils.isNotEmpty(collectionIds)) {
            documents.addAll(queryService.findAllDocumentsBySampleCollectionIdList(collectionIds))
            collectionDocsApproved = consentService.collectionDocumentsApproved(collectionIds)
        }
        List<StorageDocument> results = storageProviderService.processStorageDocuments(documents)
        Boolean attachmentsApproved = queryService.findByKey(params.issueKey).attachmentsApproved()
        Gson gson = new Gson()
        String doc = gson.toJson(results)
        render ([documents : doc, attachmentsApproved: attachmentsApproved && collectionDocsApproved] as JSON)
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
                    log.error("Error trying to delete File. Document with Uuid: ${params.uuid} not found.")
                    handleException(new NotFoundException('File to delete not found.'), 404)
                }
            } catch(Exception e) {
                log.error("Error trying to delete file with Uuid: ${params.uuid}.", e.getMessage())
                handleException(e, 500)
            }
        } else {
            log.error("Error, document to delete has an empty UuId.")
            response.status = 400
            render(['message': 'Unable to delete a file with no Id.'] as JSON)
        }
    }
}
