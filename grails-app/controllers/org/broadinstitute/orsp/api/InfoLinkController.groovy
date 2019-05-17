package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.ConsentCollectionLink

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class InfoLinkController extends AuthenticatedController {

    def showInfoLink() {
        render(view: "/infoLink/index")
    }

    def getProjectSampleCollections() {
        params
        String consentKey = params.consentKey
        String projectKey = params.projectKey
        Collection<ConsentCollectionLink> associatedSampleCollections = queryService.findCollectionLinksByConsentKeyAndProjectKey(consentKey, projectKey)
        render([sampleCollections: associatedSampleCollections] as JSON)
    }

}
