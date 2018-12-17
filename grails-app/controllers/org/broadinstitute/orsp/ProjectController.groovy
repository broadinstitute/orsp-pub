package org.broadinstitute.orsp

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.springframework.web.multipart.MultipartFile

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

    def attachDocument() {
        List<MultipartFile> files = request.multiFileMap.collect { it.value }.flatten()

        def names = []

        def issue = queryService.findByKey(params.id)
        try {
            files.forEach {
                names.push(it.name)
                if (!files.empty) {
                    storageProviderService.saveMultipartFile(
                            (String) 'Tadeo Riveros',
                            (String) 'triveros',
                            (String) issue.projectKey,
                            (String) it.name,
                            (MultipartFile) it)
                }
            }
            render(['id': issue.projectKey, 'files': names] as JSON)
//            redirect(controller: 'irb', action: "show", params: [id: issue.projectKey, tab: 'documents'])
        } catch (Exception e) {
            render([status: 500, text: [error: e.message] as JSON])
        }
    }

}
