package org.broadinstitute.orsp

import grails.artefact.Interceptor
import grails.converters.JSON
import grails.web.servlet.mvc.GrailsParameterMap
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.api.ExceptionHandler
import org.broadinstitute.orsp.utils.IssueUtils

@Slf4j
class AuthenticatedController implements Interceptor, UserInfo, ExceptionHandler {

    NotifyService notifyService
    StorageProviderService storageProviderService
    UserService userService
    QueryService queryService
    TransitionService transitionService
    IssueService issueService
    PersistenceService persistenceService
    StatusEventService statusEventService
    PermissionService permissionService

    public static final List<String> PROJECT_DOC_TYPES =
            [ "Amendment Form",
              "Appendix",
              "Application",
              "Approval Memo",
              "Consent",
              "Assent",
              "Attestation",
              "Waiver of Consent",
              "Continuing Review",
              "Correspondence",
              "Data Use Letter Pre 2015",
              "Data Use Letter Post 2015",
              "IC / Institutional Certification Pre 2015",
              "IC / Institutional Certification Post 2015",
              "Other",
              "Other Event Form",
              "Protocol",
              "Response To Conditions",
              "Summary-of-Changes",
              "Supplemental Document"]

    @Override
    boolean before() {
        if (!session["user"]) {
            session["savedParams"] = params
            redirect(controller: 'logout', action: 'required')
            return false
        }
        true
    }

    protected Collection<User> getProjectManagersForIssue(Issue issue) {
        Collection<String> pmUsernames = IssueExtraProperty.findAllByProjectKeyAndName(issue.projectKey, IssueExtraProperty.PM)*.value
        Collection<User> pms = userService.findUsers(pmUsernames) ?: new ArrayList<>()
        if (pms.isEmpty()) {
            User reporter = userService.findUser(issue.reporter)
            if (reporter) { pms.add(reporter) }
        }
        pms
    }

    protected Collection<User> getPIsForIssue(Issue issue) {
        Collection<String> pis = IssueExtraProperty.findAllByProjectKeyAndName(issue.projectKey, IssueExtraProperty.PI)*.value
        Collection<User> pisForUsers = new ArrayList<>()
        pisForUsers.addAll(userService.findUsers(pis))
        pisForUsers
    }

    protected User getRequestorForIssue(Issue issue) {
        userService.findUser(issue.reporter)
    }

    protected Collection<User> getCollaborators(Collection<String> collaboratorsList) {
        userService.findUsers(collaboratorsList) ?: new ArrayList<>()
    }

    String getType() {
        throw new Error("sub-class must implement getType for fully typed issues")
    }

    def show() {
        Issue issue = queryService.findByKey(params.id)
        if (issueIsForbidden(issue)) {
            render(view: "/mainContainer/index")
        }
        redirect([controller: issue.getController(), action: "show", params: [id: params.id, tab: "details"]])
    }

    def create() {
        throw new Error("sub-class must implement create")
    }

    def handleIntake(String key) {
        throw new Error("sub-class must implement handle intake")
    }

    def print() {
        throw new Error("sub-class must implement print")
    }

    def update() {
        Issue issue = queryService.findByKey(params.id)
        List<String> errors = validateAddOrUpdate(params, issue.getType())
        if (errors.size() > 0) {
            flash.error = errors.join("<br/>")
            redirect(controller: issue.controller, action: "edit", params: [id: params.id, tab: "details"])
            return
        }
        try {
            issueService.updateIssue(issue, (GrailsParameterMap) params)
            redirect([action: "show", params: [id: params.id, tab: "details"]])
        } catch (IOException e) {
            flash.error = e.getMessage()
            redirect([controller: issue.controller, action: "edit", params: [id: params.id, tab: "details"]])
        }
    }

    def add() {
        List<String> errors = validateAddOrUpdate(params, (String) params.type)
        if (errors.size() > 0) {
            flash.error = errors.join("<br/>")
            redirect(controller: IssueUtils.getControllerForIssueTypeName(params.type), action: "create")
            return
        }
        Date expirationDate = null
        if (params.expirationDate) {
            expirationDate = Date.parse('MM/dd/yyyy', params.expirationDate)
        }
        Issue issue = new Issue(
                type: params.type,
                status: params.status,
                summary: params.summary,
                description: params.description,
                reporter: getUser()?.userName,
                expirationDate: expirationDate,
                requestDate: new Date()
        )
        issue = issueService.addIssue(issue, params)
        // Transition issue to correct intake status:
        handleIntake(issue.projectKey)
        redirect([controller: issue.controller, action: "show", id: issue.projectKey])
    }

    /**
     * Remove an attachment from an issue.
     *
     * @return Return to the documents tab
     */
    def rmAttachment() {
        if (params.uuid) {
            def document = StorageDocument.findByUuid(params.uuid)
            storageProviderService.removeStorageDocument(document, getUser()?.displayName)
        }
        redirect(action: "show", params: [id: params.id, tab: "documents"])
    }

    def getIssue() {
        queryService.findByKey(params.id)
    }

    boolean isProject() {
        false
    }

    def abandon() {
        def issue = queryService.findByKey(params.id)
        transitionService.abandon(issue, params.comment, getUser()?.displayName)
        notifyClosedWithdrawn(issue, IssueStatus.Abandoned)
        redirect([controller: issue.controller, action: 'show', params: [id: issue.projectKey]])
    }

    def close() {
        def issue = queryService.findByKey(params.id)
        transitionService.close(issue, params.comment, getUser()?.displayName)
        notifyClosedWithdrawn(issue, IssueStatus.Closed)
        redirect([controller: issue.controller, action: 'show', params: [id: issue.projectKey]])
    }

    def collectionLinks() {
        Collection<Object> results = queryService.findCollectionLinksByProjectKey(params.id).collect {
            [
                    id: it.sampleCollection?.collectionId,
                    name: it.sampleCollection?.name,
                    category: it.sampleCollection?.category,
                    groupName: it.sampleCollection?.groupName,
                    consent: it.consentKey
            ]
        }
        render results as JSON
    }

    private def notifyClosedWithdrawn(Issue issue, IssueStatus status) {
        List<String> toAddresses = userService.findUsers(issue.getPMs())?.collect {it.emailAddress}
        String fromAddress = (String) getUser()?.emailAddress

        // Extra check to cover error condition of empty PMs
        if (toAddresses.isEmpty()) {
            log.error("Issue " + issue.projectKey + " has empty PMs.")
            toAddresses.addAll(notifyService.getOrspSpecialRecipients())
        }

        NotifyArguments arguments = new NotifyArguments(
                toAddresses: toAddresses,
                fromAddress: fromAddress,
                user: getUser(),
                issue: issue)

        switch (status) {
            case IssueStatus.Closed:
                notifyService.sendClosed(arguments)
                break
            case IssueStatus.Abandoned:
                notifyService.sendWithdrawn(arguments)
                break
            default:
                log.error("No email sent for closing/withdrawing: " + issue.projectKey)
                log.error("Can only handle Closed and Abandoned, not: " + status.name)
        }
    }

    def downloadDocument() {
        try {
            StorageDocument document = StorageDocument.findByUuid(params.uuid)
            if (document) {
                document = storageProviderService.populateDocumentFileContent(document)
                response.setContentType(document.mimeType) // or image/JPEG or text/xml or whatever type the file is
                response.setHeader("Content-disposition", "attachment;filename=\"${document.fileName}\"")
                response.outputStream << document.inputStream
            } else {
                response.setContentType("text/plain") // or image/JPEG or text/xml or whatever type the file is
                response.setHeader("Content-disposition", "attachment;filename=\"error.txt\"")
                response.outputStream << "File not found"
            }
        }
        catch (Exception e) {
            response.setContentType("text/plain") // or image/JPEG or text/xml or whatever type the file is
            response.setHeader("Content-disposition", 'attachment;filename="error.txt"')
            response.outputStream << "Error: ${e.getMessage()}"
        }
    }

    /**
     * This should not be necessary as we also catch errors at the UI level.
     * However, keeping this here for double checking at the server-side level
     *
     * @param params Grails params object
     * @param type The Issue Type
     * @return List of errors
     */
    private static List<String> validateAddOrUpdate(GrailsParameterMap params, String type) {
        List<String> errors = new ArrayList<>()

        // Global validations
        if (!params.summary) {
            errors.add("Project Title can not be blank")
        }

        // NHSR/NE-specific validations
        if (IssueUtils.isNE(type) || IssueUtils.isNHSR(type)) {
            if (BooleanOptions.getLabelForKey(params?."accurate") != "Yes") {
                errors.add("You may not submit this request until you have confirmed that the information provided is accurate and complete.")
            }
        }

        errors
    }

    /**
     * Utility function to arrange the submissions into a tabb-able view
     *
     * @param issue         The Issue
     * @param submissions   The Submissions for the issue
     * @return              Ordered map of submission type to list of submissions
     */
    protected static Map<String, List<Submission>> groupSubmissions(Issue issue, Collection<Submission> submissions) {
        Map<String, List<Submission>> groupedSubmissions = new LinkedHashMap<>()

        // Populate the keys first so the groupings are ordered correctly
        if (IssueUtils.isIrb(issue.type)) {
            SubmissionType.getIRBTypes()*.label.each {
                groupedSubmissions.put(it, new ArrayList<Submission>())
            }
        } else {
            SubmissionType.getNonIRBTypes()*.label.each {
                groupedSubmissions.put(it, new ArrayList<Submission>())
            }
        }

        // Then populate the contents for each type.
        submissions.each {
            // Should not happen, but just in case
            if (!groupedSubmissions.containsKey(it.type)) {
                groupedSubmissions.put(it.type, Collections.singletonList(it))
            } else {
                groupedSubmissions.get(it.type).add(it)
            }
        }
        groupedSubmissions
    }

    @Deprecated
    /**
     * Use getSessionUser().isAdmin instead
     */
    def isCurrentUserAdmin() {
        render([isAdmin: isAdmin()] as JSON)
    }

    def getSessionUser() {
        User user = getUser()
        render([
            'displayName': user.displayName,
            'emailAddress': user.emailAddress,
            'userName': user.userName,
            'lastLoginDate': user.lastLoginDate,
            'isAdmin': isAdmin(),
            'isORSP': isORSP(),
            "isViewer": isViewer(),
            'isComplianceOffice': isComplianceOffice(),
            'isBroad': isBroad()
        ] as JSON)
    }

    def hasSession() {
        render(['session': getUser()!=null] as JSON)
    }

    def issueIsForbidden(issue) {
        return permissionService.issueIsForbidden(issue, getUser().userName, isAdmin(), isViewer())
    }

    def redirectToMainContainer() {
      render(view: "/mainContainer/index")
    }

}
