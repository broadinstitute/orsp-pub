package org.broadinstitute.orsp.api

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueType

import org.springframework.web.multipart.MultipartFile

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

    def save() {
        Gson gson = new Gson()
        Issue project = gson.fromJson(gson.toJson(request.JSON), Issue.class)

        Issue response = issueService.createIssue(IssueType.valueOfPrefix(project.type), project)

        response.status = 201
        render([message: response] as JSON)
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

