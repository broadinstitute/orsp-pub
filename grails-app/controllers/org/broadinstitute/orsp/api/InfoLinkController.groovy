package org.broadinstitute.orsp.api

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class InfoLinkController extends AuthenticatedController {

    def showInfoLink() {
        render(view: "/infoLink/index")
    }

    def getProjectSampleCollections() {
        String consentKey = params.consentKey
        String projectKey = params.projectKey
        try {
            Gson gson = new Gson()
            def result = queryService.findCollectionLinksByConsentKeyAndProjectKey(consentKey, projectKey)

            render ([ sampleCollections : gson.toJson(result.keySet()),
                      documents: gson.toJson(result.values())
            ] as JSON)
        } catch (Exception e){
            render([]) // handle error here
        }

    }

}
