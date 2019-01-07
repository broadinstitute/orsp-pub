package org.broadinstitute.orsp.api

import grails.converters.JSON
import org.broadinstitute.orsp.AuthenticatedController
import org.springframework.web.multipart.MultipartFile

class FileHelperController extends AuthenticatedController{
    def attachDocument() {
        List<MultipartFile> files = request.multiFileMap.collect { it.value }.flatten()

        def names = []

        def issue = queryService.findByKey(params.id)
        try {
            files.forEach {
                names.push(it.name)
                if (!files.empty) {
                    storageProviderService.saveMultipartFile(
                            (String) params.displayName,
                            (String) params.userName,
                            (String) issue.projectKey,
                            (String) it.name,
                            (MultipartFile) it)
                }
            }
            render(['id': issue.projectKey, 'files': names] as JSON)
        } catch (Exception e) {
            render([status: 500, text: [error: e.message] as JSON])
        }
    }
}
