package org.broadinstitute.orsp

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class ProjectController extends AuthenticatedController {

    def pages() {
      render(view: "/newProject/index")
    }

    @Override
    def show() {
        List<String> diseaseAndPopulationRestrictions = queryService.findAllDiseaseAndPopulationRestrictions()
        response.status = 200
        render([message: diseaseAndPopulationRestrictions] as JSON)
    }

    def create() {
    }

    def edit() {
    }

    def save() {
        def value = request.JSON
        response.status = 201
        render([message: value] as JSON)
    }

    def update() {
    }

    def delete() {
    }

}
