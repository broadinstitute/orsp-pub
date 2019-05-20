package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import liquibase.util.StringUtils
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.ConsentCollectionLink

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class InfoLinkController extends AuthenticatedController {

    def showInfoLink() {
        render(view: "/infoLink/index")
    }

    def getProjectSampleCollections() {
        String consentKey = params.consentKey
        String projectKey = params.projectKey
        if (StringUtils.isNotEmpty(consentKey) && StringUtils.isNotEmpty(projectKey)) {
            Collection<ConsentCollectionLink> associatedSampleCollections = queryService.findCollectionLinksByConsentKeyAndProjectKey(consentKey, projectKey)
//            queryService.COSO(consentKey, projectKey)

//            associatedSampleCollections.collect {
//                /*collect { it.sampleCollectionId }.findAll { it && !it.isEmpty()})*/
//            }
            render([sampleCollections: associatedSampleCollections] as JSON)
        } else {
            render([]) // handle error here
        }

    }

}
