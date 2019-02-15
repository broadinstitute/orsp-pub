package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.DataUseLetterControllerService
import org.broadinstitute.orsp.utils.IssueUtils

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class DataUseLetterController extends AuthenticatedController {


    @Override
    def create () {

        println request.JSON
        Object input = IssueUtils.getJson(Map.class, request.JSON)
        dataUseLetterControllerService.generateLink(input)
        response.status = 200
        render([request.JSON] as JSON)

    }

}
