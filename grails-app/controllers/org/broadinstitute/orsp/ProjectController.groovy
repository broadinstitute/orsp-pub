package org.broadinstitute.orsp

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.springframework.web.multipart.MultipartFile
import org.broadinstitute.orsp.models.Project

/*
JSON model
 {
   "type":"IRB Project",
   "status":"Open",
   "summary":"Summary",
   "studyDescription":"Description Text",
   "reporter":"Leo",
   "requestDate":"2018-06-01",
   "projectManager":"Manager Name",
   "piName":"Pi Name",
   "pTitle":"Project Title",
   "irbProtocolId":"irb 1234 id",
   "subjectProtection":true,
   "fundings":[
      {
         "identifier":"identifier",
         "source":"Federal Sub-award",
         "sponsor":"sponsor Name"
      },
      {
         "awardNumber":"identifier 2",
         "source":"Federal Sub-award",
         "name":"Sponsor Name 2"
      }
   ],
   "collaborators":[ "name", "name2" ],
   "questions":[
      {
         "key":"feeForService",
         "answer":"true"
      },
      {
         "key":"broadInvestigator",
         "answer":"true"
      },
      {
         "key":"subjectsDeceased",
         "answer":"true"
      },
      {
         "key":"sensitiveInformationSource",
         "answer":"true"
      },
      {
         "key":"interactionSource",
         "answer":"true"
      },
      {
         "key":"isIdReceive",
         "answer":"true"
      },
      {
         "key":"isCoPublishing",
         "answer":"true"
      },
      {
         "key":"federalFunding",
         "answer":"true"
      }
   ]
}
* */

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

        Issue response = issueService.updateProject(project.getIssue(), project)

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
