package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.utils.IssueUtils

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class DataUseLetterController extends AuthenticatedController {


    @Override
    def create () {
        Object input = IssueUtils.getJson(Map.class, request.JSON)
        try {
            String linkId = dataUseLetterService.generateDul(input)
            response.status = 200
            render([dulToken: linkId] as JSON)
        } catch(Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }
    }

    @Override
    def update () {
        Object input = IssueUtils.getJson(Map.class, request.JSON)
        try {
            dataUseLetterService.udpateDataUseLetter(input)
            response.status = 200
            render(response.status as JSON)
        } catch(IllegalArgumentException e) {
            response.status = 400
            render([error: "Form has been already submitted"] as JSON)
        } catch(Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }
    }
}
