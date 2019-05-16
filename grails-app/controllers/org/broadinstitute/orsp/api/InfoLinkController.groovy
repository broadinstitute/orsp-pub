package org.broadinstitute.orsp.api

import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class InfoLinkController extends AuthenticatedController {

    def showInfoLink() {
        render(view: "/infoLink/index")
    }

}
