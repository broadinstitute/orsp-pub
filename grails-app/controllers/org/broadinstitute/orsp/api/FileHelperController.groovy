package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.StorageDocument
import org.springframework.web.multipart.MultipartFile

import java.text.SimpleDateFormat

@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class FileHelperController extends AuthenticatedController{
    private static final String APPROVED = "Approved"
    private static final String REJECTED = "Rejected"
    private static final String PENDING = "Pending"


    def attachDocument() {
        List<MultipartFile> files = request.multiFileMap.collect { it.value }.flatten()

        def names = []

        def issue = queryService.findByKey(params.id)
        try {
            files.forEach {
                names.push(it.name)
                if (!files.empty) {
                    println it.contentType
                    println it.originalFilename
                    println it.name
                    def document = new StorageDocument(
                            projectKey: issue.projectKey,
                            fileName: it.originalFilename,
                            fileType: it.name,
                            mimeType: it.contentType,
                            uuid: UUID.randomUUID().toString(),
                            creator: params.displayName,
                            username: params.userName,
                            creationDate: new SimpleDateFormat().format(new Date()),
                            status: PENDING
                    )
                    storageProviderService.saveStorageDocument(document, it.getInputStream())
                }
            }
            render(['id': issue.projectKey, 'files': names] as JSON)
        } catch (Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }
    }

    def rejectDocument() {
        StorageDocument document = StorageDocument.findByUuid(params.uuid)
        try {
            if (document != null) {
                document.setStatus(REJECTED)
                document.save(flush: true)
                render(['document': document] as JSON)
            } else {
                response.status = 500
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
                document.setStatus(APPROVED)
                document.save(flush: true)
                render(['document': document] as JSON)
            } else {
                response.status = 500
                render([error: 'Document not found'] as JSON)
            }
        } catch (Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }
    }

}
