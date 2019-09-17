package org.broadinstitute.orsp.api

import com.google.gson.JsonArray
import com.google.gson.JsonParser
import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.apache.commons.lang.StringUtils
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.EventType
import org.broadinstitute.orsp.Funding
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueStatus
import org.broadinstitute.orsp.IssueType
import org.broadinstitute.orsp.ProjectExtraProperties
import org.broadinstitute.orsp.SupplementalRole
import org.broadinstitute.orsp.User
import org.broadinstitute.orsp.utils.IssueUtils
import org.springframework.web.multipart.MultipartFile

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class ProjectController extends AuthenticatedController {

    def main() {
        Issue issue = queryService.findByKey(params.projectKey)
        if (issueIsForbidden(issue)) {
            render(view: "/mainContainer/index")
        }
        render(view: "/mainContainer/index", model: [projectKey: params.projectKey, issueType: 'project'])
    }

    @Override
    def show() {
        List<String> diseaseAndPopulationRestrictions = queryService.findAllDiseaseAndPopulationRestrictions()
        response.status = 200
        render([message: diseaseAndPopulationRestrictions] as JSON)
    }

    def save() {
        List<MultipartFile> files = request.multiFileMap.collect { it.value }.flatten()
        User user = getUser()
        String dataProject = request.parameterMap["dataProject"].toString()
        JsonParser parser = new JsonParser()
        JsonArray dataProjectJson = parser.parse(dataProject)
        String projectKey
        try {
            Issue parsedIssue = IssueUtils.getJson(Issue.class, dataProjectJson[0])
            Issue issue = issueService.createIssue(IssueType.valueOfPrefix(parsedIssue.type), parsedIssue)
            handleIntake(issue.projectKey)
            persistenceService.saveEvent(issue.projectKey, user?.displayName, "New Project Added", EventType.SUBMIT_PROJECT)
            projectKey = issue.projectKey
            if (!files?.isEmpty()) {
                files.forEach {
                    storageProviderService.saveMultipartFile(user.displayName, user.userName, projectKey, it.name , it, null)
                }
            }
            notifyService.projectCreation(issue)
            issue.status = 201
            render([message: issue] as JSON)
        } catch (Exception e) {
            issueService.deleteIssue(projectKey)
            handleException(e)
        }

    }

    def modifyExtraProperties() {
        String projectKey = params.id
        Object input = IssueUtils.getJson(Object.class, request.JSON)

        try {
            Issue updatedIssue = issueService.modifyExtraProperties(input, projectKey)
            render([message: updatedIssue] as JSON)
        } catch(Exception e) {
            handleException(e)
        }
    }

    @SuppressWarnings(["GroovyAssignabilityCheck"])
    def getProject() {
        String projectKey = params.id
        Issue issue = queryService.findByKey(projectKey)
        Collection<Funding> fundingList = issue.getFundings()
        ProjectExtraProperties projectExtraProperties = new ProjectExtraProperties(issue)
        Collection<User> colls = getCollaborators(projectExtraProperties.collaborators)
        render([issue             : issue,
                requestor         : getRequestorForIssue(issue),
                pms               : getProjectManagersForIssue(issue),
                pis               : getPIsForIssue(issue),
                fundings          : fundingList,
                extraProperties   : projectExtraProperties,
                collaborators     : colls,
                attachmentsApproved: issue.attachmentsApproved()
        ] as JSON)
    }

    def delete() {
        Issue issue = queryService.findByKey(params.projectKey)
        if(issue != null) {
            issueService.deleteIssue(params.projectKey)
            persistenceService.saveEvent(issue.projectKey, getUser()?.displayName, "Project Rejected", EventType.REJECT_PROJECT)
            response.status = 200
            render([message: 'Project was deleted'] as JSON)
        } else {
            handleNotFound('Project not found')
        }
    }


    def update() {
        Map<String, Object> project = IssueUtils.getJson(Map.class, request.JSON)
        Issue issue = Issue.findByProjectKey(params.projectKey)
        try {
            issueService.updateIssue(issue, project)
            response.status = 200
            render([message: 'Project was updated'] as JSON)
        } catch(Exception e) {
            handleException(e)
        }
    }

    def updateAdminOnlyProps() {
        Map<String, Object> project = IssueUtils.getJson(Map.class, request.JSON)
        try {
            issueService.updateAdminOnlyProperties(project)
            response.status = 200
            render([message: 'Project was updated'] as JSON)
        } catch(Exception e) {
            handleException(e)
        }
    }


    def handleIntake(String key) {
        Issue issue = queryService.findByKey(key)
        transitionService.handleIntake(issue, [SupplementalRole.ORSP], IssueStatus.PreparingApplication.name)
    }

    String getProjectType() {
        String projectType = issueService.getProjectType(params.id)
        if (StringUtils.isNotEmpty(projectType)) {
            response.status = 200
            render([projectType: projectType] as JSON)
        } else {
            handleNotFound('Project not found')
        }
        projectType
    }
}
