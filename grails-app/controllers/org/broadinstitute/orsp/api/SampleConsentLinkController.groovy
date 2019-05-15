package org.broadinstitute.orsp.api

import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class SampleConsentLinkController extends AuthenticatedController {

    def pages() {
        render(view: "/sampleConsentLinkWizard/index")
    }
}
