package org.broadinstitute.orsp.api

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.ConsentCollectionLinkDTO
import org.broadinstitute.orsp.StorageDocument

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class InfoLinkController extends AuthenticatedController {

    def showInfoLink() {
        render(view: "/infoLink/index")
    }

    def getProjectSampleCollections() {
        String consentKey = params.consentKey
        String projectKey = params.projectKey
        String sampleCollectionId = params.scId
        try {
            Gson gson = new Gson()
            Map<ConsentCollectionLinkDTO, List<StorageDocument>> result = queryService.findSpecificCollectionLink(consentKey, projectKey, sampleCollectionId)
            render ([ sampleCollections : gson.toJson(result.keySet()),
                      documents: gson.toJson(result.values())
            ] as JSON)
        }  catch (Exception e) {
            log.error("There was an error trying to get consent collection info: " + e.message)
            response.status = 500
            render([error: e.message] as JSON)
        }
    }
}
