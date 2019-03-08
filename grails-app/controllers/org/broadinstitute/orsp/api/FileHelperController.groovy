package org.broadinstitute.orsp.api

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.DocumentStatus
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueType
import org.broadinstitute.orsp.StorageDocument
import org.broadinstitute.orsp.StorageProviderService
import org.broadinstitute.orsp.User
import org.springframework.web.multipart.MultipartFile

import java.text.SimpleDateFormat

@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class FileHelperController extends AuthenticatedController{

    StorageProviderService storageProviderService;

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
                            creationDate: new SimpleDateFormat().format(new Date()),
                            status: DocumentStatus.PENDING.status
                    )
                    storageProviderService.saveStorageDocument(document, it.getInputStream())
                }
            }
            notifyService.projectCGCreation(issue)
            render(['id': issue.projectKey, 'files': names] as JSON)
        } catch (Exception e) {
            response.status = 500
            issueService.deleteIssue(issue.projectKey)
            deleteDocuments(issue)
            render([error: e.message] as JSON)
        }
    }

    def rejectDocument() {
        StorageDocument document = StorageDocument.findByUuid(params.uuid)
        try {
            if (document != null) {
                document.setStatus(DocumentStatus.REJECTED.status)
                document.save(flush: true)
                render(['document': document] as JSON)
            } else {
                response.status = 404
                render([error: 'Document not found'] as JSON)
            }
        } catch (Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }
    }

    def approveDocument() {
        StorageDocument document = StorageDocument.findByUuid(params.uuid)
        try {
            if (document != null) {
                document.setStatus(DocumentStatus.APPROVED.status)
                document.save(flush: true)

                Issue issue = queryService.findByKey(document.projectKey)
                issueService.updateProjectApproval(issue)

                render(['document': document] as JSON)
            } else {
                response.status = 404
                render([error: 'Document not found'] as JSON)
            }
        } catch (Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }
    }

    def attachedDocuments() {
        Collection<StorageDocument> documents = queryService.getDocumentsForProject(params.issueKey)
        List<StorageDocument> results = storageProviderService.processStorageDocuments(documents)
        Gson gson = new Gson()
        String doc = gson.toJson(results)
        render ([documents : doc] as JSON)
    }

    def updateDocumentsVersion() {
        storageProviderService.updateSingleDocVersionType()
        response.status = 200
        render (['message': 'documents versions updated'] as JSON)
    }

    private void deleteDocuments(Issue issue) {
        Collection<StorageDocument> documents = queryService.getDocumentsForProject(issue.projectKey)
        if (documents != null) {
            documents.forEach {
                storageProviderService.removeStorageDocument(it, getUser()?.userName)
            }
        }
    }
}
