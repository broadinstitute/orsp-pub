package org.broadinstitute.orsp.api

import com.google.gson.JsonArray
import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.apache.commons.lang.StringUtils
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.EventType
import org.broadinstitute.orsp.Funding
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueExtraProperty
import org.broadinstitute.orsp.IssueStatus
import org.broadinstitute.orsp.IssueType
import org.broadinstitute.orsp.KeyPerson
import org.broadinstitute.orsp.PiStudyStaff
import org.broadinstitute.orsp.PmStudyStaff
import org.broadinstitute.orsp.ProjectExtraProperties
import org.broadinstitute.orsp.SupplementalRole
import org.broadinstitute.orsp.User
import org.broadinstitute.orsp.VersionedFunding
import org.broadinstitute.orsp.VersionedIssue
import org.broadinstitute.orsp.VersionedIssueExtraProperty
import org.broadinstitute.orsp.VersionedKeyPerson
import org.broadinstitute.orsp.utils.IssueUtils
import org.springframework.web.multipart.MultipartFile
import org.broadinstitute.orsp.CollaboratorMigrationService

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class ProjectController extends AuthenticatedController {
    CollaboratorMigrationService collaboratorMigrationService

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
            JsonObject jsonObject = projectDataJson[0]?.asJsonObject

            parsedIssue.primaryPi =
                    jsonObject?.get("primaryPi")?.asJsonArray?.collect { it.asString } ?: []

            parsedIssue.additionalPis =
                    jsonObject?.get("additionalPis")?.asJsonArray?.collect { it.asString } ?: []

            parsedIssue.primaryPm =
                    jsonObject?.get("primaryPm")?.asJsonArray?.collect { it.asString } ?: []

            parsedIssue.additionalPms =
                    jsonObject?.get("additionalPms")?.asJsonArray?.collect { it.asString } ?: []
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
//                    collaboratorMigrationService.migrateIfRequired(issue)
                    Collection<Funding> fundingList = issue.getFundings()
//                    Collection<KeyPerson> keyPersonList = issue.getKeyPersons()
                    ProjectExtraProperties projectExtraProperties = new ProjectExtraProperties(issue)
                    Collection<User> colls = getCollaborators(projectExtraProperties.collaborators)
                    if (issue.updateUser) {
                        issue.updateUser = userService.findUser(issue.updateUser).displayName
                    }
                    render([issue              : issue,
                            requestor          : getRequestorForIssue(issue),
                            fundings           : fundingList,
                            extraProperties    : projectExtraProperties,
                            collaborators      : colls,
                            attachmentsApproved: issue.attachmentsApproved(),
                            keyPersons         : [],
                            allPis             : getAllPisForIssue(issue),
                            allPms             : getAllPmsForIssue(issue)
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

    protected Collection<Map> getAllPisForIssue(Issue issue) {

        if (!issue) {
            return []
        }

        Collection<PiStudyStaff> piList =
                PiStudyStaff.findAllByIssue(issue) ?: []

        if (!piList) {
            return []
        }

        Collection<String> usernames =
                piList*.pi?.findAll { it }?.unique() ?: []

        if (!usernames) {
            return []
        }

        Collection<User> users =
                userService.findUsers(usernames) ?: []

        Map<String, User> userMap =
                users.collectEntries { [(it.userName): it] }

        return piList.collect { piStaff ->

            User user = userMap[piStaff.pi]

            [
                    emailAddress : user?.emailAddress,
                    userName     : user?.userName,
                    displayName  : user?.displayName,
                    piType       : piStaff?.piType
            ]
        }
    }

    protected Collection<Map> getAllPmsForIssue(Issue issue) {

    if (!issue) {
        return []
    }

    Collection<PmStudyStaff> pmList =
            PmStudyStaff.findAllByIssue(issue) ?: []

    if (!pmList) {
        return []
    }

    Collection<String> usernames =
            pmList*.pm?.findAll { it }?.unique() ?: []

    if (!usernames) {
        return []
    }

    Collection<User> users =
            userService.findUsers(usernames) ?: []

    Map<String, User> userMap =
            users.collectEntries { [(it.userName): it] }

    return pmList.collect { pmStaff ->

        User user = userMap[pmStaff.pm]

        [
                emailAddress : user?.emailAddress,
                userName     : user?.userName,
                displayName  : user?.displayName,
                pmType       : pmStaff?.pmType
        ]
    }
}


    def migrateCollaborators() {
        String projectKey = params.id
        Issue issue = queryService.findByKey(projectKey)

        if (!issue || issueIsForbidden(issue)) {
            handleNotFound('Project not found')
            return
        }

        collaboratorMigrationService.migrateCollaborator(issue)

        Collection<KeyPerson> keyPersons =
                KeyPerson.findAllByProjectKeyAndDeleted(projectKey, false)

        render([
                projectKey : projectKey,
                keyPersons : getKeyPersonsForIssueMergedFromList(keyPersons)
        ] as JSON)
    }

    protected Collection<Map> getKeyPersonsForIssueMergedFromList(
            Collection<KeyPerson> keyPersons) {

        if (!keyPersons) {
            return []
        }

        Collection<String> usernames =
                keyPersons*.name.findAll { it }.unique()

        Collection<User> users = userService.findUsers(usernames)

        Map<String, User> userMap =
                users.collectEntries { [(it.userName): it] }

        keyPersons.collect { kp ->
            User user = userMap[kp.name]

            [
                    id           : user?.id,
                    keyPersonCreatedDate  : kp?.createdDate,
                    emailAddress : user?.emailAddress,
                    userName     : user?.userName,
                    updatedDate  : kp?.updatedTimestamp,
                    displayName  : user?.displayName,
                    name         : kp.name,
                    role         : kp.role,
                    otherRole    : kp.otherRole
            ]
        }
    }

//    protected Collection<Map> getKeyPersonsForIssueMerged(Issue issue) {
//
//        Collection<KeyPerson> keyPersons = issue.getKeyPersons()
//        if (!keyPersons) {
//            return []
//        }
//        Collection<String> usernames = keyPersons*.name.findAll { it }.unique()
//        Collection<User> users = userService.findUsers(usernames)
//        Map<String, User> userMap =
//                users.collectEntries { [(it.userName): it] }
//        keyPersons.collect { kp ->
//            User user = userMap[kp.name]
//
//            [
//                    id            : user?.id,
//                    createdDate   : kp?.createdDate,
//                    emailAddress  : user?.emailAddress,
//                    userName      : user?.userName,
//                    updatedDate   : kp?.updatedTimestamp,
//                    displayName   : user?.displayName,
//                    name          : kp.name,
//                    role          : kp.role,
//                    otherRole     : kp.otherRole
//            ]
//        }
//    }


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
            issueService.saveVersionedIssue(issue)
            issueService.saveVersionedFunding(issue)
            issueService.saveVersionedIssueExtraProperties(issue)
            issueService.saveVersionedKeyPerson(issue)
            issueService.saveVersionedPiStudyStaff(issue)
            issueService.saveVersionedPmStudyStaff(issue)
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

    def getProjectBySequenceNumber() {
        def projectKey = params.projectKey
        def sequenceNumber = params.sequenceNumber

        def versionedIssue = VersionedIssue.findAllByProjectKeyAndSequenceNumber(projectKey, sequenceNumber)
        def versionedIssueExtraProp = VersionedIssueExtraProperty.findAllByProjectKeyAndSequenceNumber(projectKey, sequenceNumber)
        def versionedIssueFunding = VersionedFunding.findAllByProjectKeyAndSequenceNumber(projectKey, sequenceNumber)
        def versionedKeyPersons = VersionedKeyPerson.findAllByProjectKeyAndSequenceNumber(projectKey, sequenceNumber)
        Collection<User> colls = getCollaborators(
                versionedIssueExtraProp.findAll {it.name == IssueExtraProperty.COLLABORATOR }.collect {it.value}
        )

        response.status = 200
        render([
                issue: versionedIssue[0],
                extraProperties: versionedIssueExtraProp,
                fundings: versionedIssueFunding,
                pms: getProjectManagersForVersionedIssue(versionedIssue[0]),
                pis: getPIsForVersionedIssue(versionedIssue[0]),
                collaborators: colls,
                requestor: userService.findUser(versionedIssue.reporter),
                keypersons:getKeyPersonsForVersionedIssueMerged(versionedKeyPersons)
        ] as JSON)
    }

    protected Collection<Map> getKeyPersonsForVersionedIssueMerged(Collection<VersionedKeyPerson> versionedKeyPersons) {

        if (!versionedKeyPersons) {
            return []
        }
        Collection<VersionedKeyPerson> activeKeyPersons =
                versionedKeyPersons.findAll { !it.deleted }
        if (!activeKeyPersons) {
            return []
        }
        Collection<String> usernames = activeKeyPersons*.name.findAll { it }.unique()
        Collection<User> users = userService.findUsers(usernames)
        Map<String, User> userMap = users.collectEntries { [(it.userName): it] }
        activeKeyPersons
                .sort { it.sequenceNumber }
                .collect { vkp ->
                    User user = userMap[vkp.name]

                    [
                            id            : user?.id,
                            createdDate   : user?.createdDate,
                            keyPersonCreatedDate: vkp?.createdDate,
                            emailAddress  : user?.emailAddress,
                            userName      : user?.userName,
                            updatedDate   : vkp?.updatedTimestamp,
                            lastLoginDate : user?.lastLoginDate,
                            roles         : user?.roles,
                            displayName   : user?.displayName,
                            name          : vkp.name,
                            role          : vkp.role,
                            otherRole     : vkp.otherRole,
                            sequence      : vkp.sequenceNumber
                    ]
                }
    }

}
