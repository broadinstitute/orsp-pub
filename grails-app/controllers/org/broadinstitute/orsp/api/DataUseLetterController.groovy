package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.DataUseLetter
import org.broadinstitute.orsp.DataUseLetterService
import org.broadinstitute.orsp.utils.IssueUtils

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class DataUseLetterController extends AuthenticatedController {
    DataUseLetterService dataUseLetterService

    @Override
    @SuppressWarnings(["GroovyAssignabilityCheck"])
    def create () {
        DataUseLetter inputDul = IssueUtils.getJson(DataUseLetter.class, request.JSON)
        try {
            DataUseLetter newDul = dataUseLetterService.generateDul(inputDul)
            response.status = 200
            render([dulToken: newDul.getUid()] as JSON)
        } catch(Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }
    }

    @Override
    def update () {
        DataUseLetter input = IssueUtils.getJson(DataUseLetter.class, request.JSON)
        try {
            dataUseLetterService.udpateDataUseLetter(input)
            response.status = 200
            render(response.status)
        } catch(IllegalArgumentException e) {
            response.status = 400
            render([error: "Form has been already submitted"] as JSON)
        } catch(Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }
    }

    def show() {
        String uid = request.parameterMap["id"]?.first()
        DataUseLetter dul = DataUseLetter.findByUid(uid)
        if(dul == null) {
            render(view: "/dataUseLetter/index", model: [error: 'notFound'])
        } else if(dul.submitted) {
            render(view: "/dataUseLetter/index", model: [error: 'submitted'])
        } else {
            render(view: "/dataUseLetter/index")
        }
    }

}
