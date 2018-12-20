package org.broadinstitute.orsp

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.springframework.web.multipart.MultipartFile
import org.broadinstitute.orsp.models.Project

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


    def edit() {
    }

    def save() {
        Gson gson = new Gson()
        Project project = gson.fromJson(gson.toJson(request.JSON), Project.class)

        Issue response = issueService.createProject(project.getIssue(), project)

        response.status = 201
        render([message: response] as JSON)
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
                            (String) params.displayName,
                            (String) params.userName,
                            (String) issue.projectKey,
                            (String) it.name,
                            (MultipartFile) it)
                }
            }
            render(['id': issue.projectKey, 'files': names] as JSON)
        } catch (Exception e) {
            render([status: 500, text: [error: e.message] as JSON])
        }
    }

}
