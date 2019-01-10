package org.broadinstitute.orsp.api

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.Funding
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueStatus
import org.broadinstitute.orsp.IssueType
import org.broadinstitute.orsp.User


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

        Issue issue = issueService.createIssue(IssueType.valueOfPrefix(project.type), project)
        handleIntake(issue.projectKey)
        issue.status = 201
        render([message: issue] as JSON)
    }

    def addExtraProperties() {
        String projectKey = params.id
        Issue issue = queryService.findByKey(projectKey)
        Gson gson = new Gson()
        Object input = gson.fromJson(gson.toJson(request.JSON), Object.class)
        Issue updatedIssue = issueService.modifyExtraProperties(issue, input)
        render([message: updatedIssue] as JSON)
    }

    @SuppressWarnings(["GroovyAssignabilityCheck"])
    def getProject() {
        String projectKey = params.id
        Issue issue = queryService.findByKey(projectKey)
        Collection<Funding> fundingList = issue.getFundings()
        LinkedHashMap<String, Object> extraProperties =  issue.getExtraPropertiesMap()
        Collection<User> colls = getCollaborators(extraProperties.collaborators)
        render([issue             : issue,
                requestor         : getRequestorForIssue(issue),
                pms               : getProjectManagersForIssue(issue).getAt(0),
                pis               : getPIsForIssue(issue).getAt(0),
                fundings          : fundingList,
                extraProperties   : extraProperties,
                collaborators     : colls
        ] as JSON)
    }

    //NE y NHSR
    @Override
    handleIntake(String key) {
        Issue issue = queryService.findByKey(key)
        Collection<User> actors = getProjectManagersForIssue(issue)
        if(issue.getType() == IssueType.IRB.name) {
            transitionService.handleIntake(issue, actors*.userName, IssueStatus.PreparingApplication.name, getUser()?.displayName)
        } else {
            transitionService.handleIntake(issue, actors*.userName, IssueStatus.SubmittingToORSP.name, getUser()?.displayName)

        }
    }
}
