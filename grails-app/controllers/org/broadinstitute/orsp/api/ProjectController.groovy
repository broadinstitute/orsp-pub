package org.broadinstitute.orsp.api

import com.google.gson.JsonArray
import com.google.gson.JsonElement
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

    @Override
    def show() {
        List<String> diseaseAndPopulationRestrictions = queryService.findAllDiseaseAndPopulationRestrictions()
        response.status = 200
        render([message: diseaseAndPopulationRestrictions] as JSON)
    }

    def save() {
        List<MultipartFile> files = request.multiFileMap.collect { it.value }.flatten()
        User user = getUser()
        JsonParser parser = new JsonParser()
        String projectData = request.parameterMap["projectData"].toString()
        String reviewer = request.parameterMap["reviewer"].toString()
        JsonElement jsonFileDescription = parser.parse(request?.parameterMap["fileData"].toString())
        JsonArray fileData
        JsonArray projectDataJson = parser.parse(projectData)
        JsonElement reviewerJson = parser.parse(reviewer)
        String reviewerUsername = reviewerJson.getAt(0).key
        reviewerUsername = reviewerUsername.replace('"', '')
        String projectKey
        if (jsonFileDescription.jsonArray) {
            fileData = jsonFileDescription.asJsonArray
        }
        try {
            Issue parsedIssue = IssueUtils.getJson(Issue.class, projectDataJson[0])
            Issue issue = issueService.createIssue(IssueType.valueOfPrefix(parsedIssue.type), parsedIssue)
            handleIntake(issue.projectKey)
            persistenceService.saveEvent(issue.projectKey, user?.displayName, "New Project Added", EventType.SUBMIT_PROJECT)
            projectKey = issue.projectKey
            if (!files?.isEmpty()) {
                files.forEach {
                    String description = fileData.find {data -> data.fileName.value == it.originalFilename }.fileDescription.value
                    storageProviderService.saveMultipartFile(user.displayName, user.userName, projectKey, it.name , it, null, description)
                }
            }
            notifyService.projectCreation(issue, reviewerUsername)
            organizationService.organizationsMatch(issue)
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


    def removeAssignedAdmin() {
        String projectKey = params.projectKey
        try {
            if (!isAdmin()) {
                handleForbidden()
            }
            Issue updatedIssue = issueService.removeAssignedAdmin(projectKey)
            render([message: updatedIssue] as JSON)
        } catch(Exception e) {
            handleException(e)
        }
    }

    @SuppressWarnings(["GroovyAssignabilityCheck"])
    def getProject() {
        try {
            String projectKey = params.id
            if (!StringUtils.isEmpty(projectKey)) {
                Issue issue = queryService.findByKey(projectKey)
                if (issue != null && !issueIsForbidden(issue)) {
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
                } else if (issue != null) {
                    response.status = 403
                } else {
                    handleNotFound('Project not found')
                }
            } else {
             handleIllegalArgumentException(new IllegalArgumentException("project key is required"))
            }
        } catch (Exception e) {
            handleException(e)
        }
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

    def updateKey() {
        Map<String, Object> project = IssueUtils.getJson(Map.class, request.JSON)
        Issue issue = Issue.findByProjectKey(params.projectKey)
        try {
            if (project.containsKey("type") && StringUtils.isNotBlank(project.get("type"))) {
                issueService.updateProjectkey(issue, project)
            }
            response.status = 200
            render([message: issue.projectKey] as JSON)
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
