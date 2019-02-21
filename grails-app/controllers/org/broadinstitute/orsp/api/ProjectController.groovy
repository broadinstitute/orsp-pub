package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.Funding
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueStatus
import org.broadinstitute.orsp.IssueType
import org.broadinstitute.orsp.User
import org.broadinstitute.orsp.utils.IssueUtils


@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class ProjectController extends AuthenticatedController {

    def pages() {
        render(view: "/newProject/index")
    }

    def dul() {
        render(view: "/dataUseLetter/index")
    }

    @Override
    def show() {
        List<String> diseaseAndPopulationRestrictions = queryService.findAllDiseaseAndPopulationRestrictions()
        response.status = 200
        render([message: diseaseAndPopulationRestrictions] as JSON)
    }

    def save() {
        Issue project = IssueUtils.getJson(Issue.class, request.JSON)
        Issue issue = issueService.createIssue(IssueType.valueOfPrefix(project.type), project)
        handleIntake(issue.projectKey)
        notifyService.sendAdminNotification("Project Type", issue)
        issue.status = 201
        render([message: issue] as JSON)
    }

    def modifyExtraProperties() {
        String projectKey = params.id
        Object input = IssueUtils.getJson(Object.class, request.JSON)

        try {
            Issue updatedIssue = issueService.modifyExtraProperties(input, projectKey)
            render([message: updatedIssue] as JSON)
        } catch(Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }

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
                pms               : getProjectManagersForIssue(issue),
                pis               : getPIsForIssue(issue),
                fundings          : fundingList,
                extraProperties   : extraProperties,
                collaborators     : colls
        ] as JSON)
    }

    def delete() {
        Issue issue = queryService.findByKey(params.projectKey)
        if(issue != null) {
            issueService.deleteIssue(params.projectKey)
            response.status = 200
            render([message: 'Project was deleted'] as JSON)
        } else {
            response.status = 404
            render([message: 'Project not found'] as JSON)
        }
    }


    def update() {
        Map<String, Object> project = IssueUtils.getJson(Map.class, request.JSON)
        Issue issue = Issue.findByProjectKey(params.projectKey)
        issueService.updateIssue(issue, project)
        response.status = 200
        render([message: 'Project was updated'] as JSON)
    }

    def handleIntake(String key) {
        Issue issue = queryService.findByKey(key)
        Collection<User> actors = getProjectManagersForIssue(issue)
        if(issue.getType() == IssueType.IRB.name) {
            transitionService.handleIntake(issue, actors*.userName, IssueStatus.PreparingApplication.name, getUser()?.displayName)
        } else {
            transitionService.handleIntake(issue, actors*.userName, IssueStatus.SubmittingToORSP.name, getUser()?.displayName)
        }
    }
}
