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

    def getProjectSampleCollections() {
        String consentCollectionId = params.cclId
        try {
            Gson gson = new Gson()
            Map<ConsentCollectionLinkDTO, List<StorageDocument>> result = queryService.findSpecificCollectionLink(consentCollectionId)
            if (result.isEmpty()) {
                handleNotFound("There is no association for the given set of ids.  Collection link info Id: ${consentCollectionId}")
            } else {
                render ([ sampleCollections : gson.toJson(result.keySet()),
                          documents: gson.toJson(result.values())
                ] as JSON)
            }
        }  catch (Exception e) {
            handleException(e)
        }
    }
}
