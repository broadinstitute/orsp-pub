package org.broadinstitute.orsp

import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.springframework.web.multipart.MultipartFile

/**
 * extend BaseController with actions specific to 'Not Engaged' and 'NHSR' projects.
 */
@Slf4j
class NeController extends AuthenticatedController {

    public static List<String> ATTACHMENT_DOC_TYPES = ["Other"]

    public static final Map<String, String> NON_IRB_STATUS_TEMPLATES =
            ["submitting to orsp": "submit",
             "reviewing form": "review",
             "getting cco approval": "getApproval"]

    @Override
    String getType() { IssueType.NE.controller }

    @Override
    boolean isProject() {
        true
    }

    @Override
    handleIntake(String key) {
        Issue issue = queryService.findByKey(key)
        Collection<User> actors = getProjectManagersForIssue(issue)
        transitionService.handleIntake(issue, actors*.userName, IssueStatus.SubmittingToORSP.name, getUser()?.displayName)
    }

    @Override
    create() {
        Issue issue = queryService.findByKey(params.id)
        [date: new Date(), issue: issue]
    }

    def edit() {
        Issue issue = queryService.findByKey(params.id)
        [issue: issue,
         pms: getProjectManagersForIssue(issue),
         pis: getPIsForIssue(issue),
         extraProperties: issue.getExtraProperties()]
    }

    @Override
    show() {
        Issue issue = queryService.findByKey(params.id)
        if (issueIsForbidden(issue)) {
            redirect(controller: 'Index', action: 'index')
        }
        Collection<Submission> submissions = queryService.getSubmissionsByProject(issue.projectKey)
        Map<String, List<Submission>> groupedSubmissions = groupSubmissions(issue, submissions)
        Collection<StorageDocument> storageDocuments = queryService.getDocumentsForProject(issue.projectKey)

        [issue             : issue,
         pms               : getProjectManagersForIssue(issue),
         pis               : getPIsForIssue(issue),
         workspaceTemplate : NON_IRB_STATUS_TEMPLATES.get(issue?.status?.toLowerCase(), ""),
         extraProperties   : issue.getExtraProperties(),
         attachments       : issue.attachments?.sort { a, b -> b.createDate <=> a.createDate },
         attachmentTypes   : ATTACHMENT_DOC_TYPES,
         tab               : params.tab,
         amendmentTypes    : SUBMISSION_DOC_TYPES,
         storageDocuments  : storageDocuments,
         groupedSubmissions: groupedSubmissions
        ]
    }

    def attachDocument() {
        Issue issue = queryService.findByKey(params.id)
        try {
            if (request.multiFileMap?.files) {
                storageProviderService.saveMultipartFiles(
                        (String) getUser()?.displayName,
                        (String) getUser()?.userName,
                        (String) issue.projectKey,
                        (String) params.type,
                        (Collection<MultipartFile>) request.multiFileMap.files)
            }
            redirect(controller: issue.controller, action: "show", params: [id: issue.projectKey, tab: 'documents'])
        } catch (Exception e) {
            render([status: 500, text: [error: e.message] as JSON])
        }
    }

    /**
     * transition to "Reviewing form", setting "submitted" to true
     */
    def submit() {
        Issue issue = queryService.findByKey(params.id)
        Collection<User> actors = getProjectManagersForIssue(issue)
        transitionService.submit(issue, params.comment, getUser()?.displayName)
        def recipients = actors.collect{it.emailAddress} + "orsp-portal@broadinstitute.org"
        notifyService.sendApplicationSubmit(
                new NotifyArguments(
                        comment: params.comment,
                        toAddresses: recipients,
                        subject: "Project Submission Received by ORSP: " + issue.projectKey,
                        user: getUser(),
                        issue: issue)
        )
        redirect([action: "show", id: params.id])
    }

    /**
     * transition back to "Submitting to ORSP", setting "modRequested",
     * and clearing "submitted"
     */
    def modify() {
        Issue issue = queryService.findByKey(params.id)
        Collection<User> actors = getProjectManagersForIssue(issue)
        transitionService.modify(issue, actors*.userName, params.comment, getUser()?.displayName)
        notifyService.sendRequestModification(
                new NotifyArguments(
                        comment: params.comment,
                        view: "/notify/requestMod",
                        subject: "ORSP Requests Modification to: " + issue.projectKey,
                        toAddresses: actors?.collect {it.emailAddress},
                        ccAddresses: notifyService.getOrspSpecialRecipients(),
                        user: getUser(),
                        issue: issue
                )
        )
        redirect([action: "show", id: params.id])
    }

    /**
     * transition to "Getting CCO Approval"
     */
    def accept() {
        Issue issue = queryService.findByKey(params.id)
        transitionService.accept(issue, params.comment, getUser()?.displayName)
        notifyService.sendNonIrbCcoReview(
                new NotifyArguments(
                        comment: params.comment,
                        subject: "ORSP Project Requires Your review: " + issue.projectKey,
                        toAddresses: SupplementalRole.CCO_USERS.collect { it + "@broadinstitute.org" },
                        ccAddresses: notifyService.getOrspSpecialRecipients(),
                        user: getUser(),
                        issue: issue
                )
        )
        redirect([action: "show", id: params.id])
    }

    /**
     * transition to "Complete"
     */
    def signed() {
        Issue issue = queryService.findByKey(params.id)
        transitionService.neComplete(issue, params.comment, getUser()?.displayName)
        Collection<User> actors = getProjectManagersForIssue(issue)
        notifyService.sendNotEngagedDetermination(
                new NotifyArguments(
                        toAddresses: actors?.collect {it.emailAddress},
                        subject: "Broad Determined to be Not Engaged: " + issue.projectKey,
                        comment: params.comment,
                        user: getUser(),
                        issue: issue
                )
        )
        redirect([action: "show", id: params.id])
    }

    @Override
    print() {
        Issue issue = queryService.findByKey(params.id)
        Collection<IssueExtraProperty> extraProperties = issue.getExtraProperties()
        renderPdf(
                template: "/ne/print",
                model: [issue: issue,
                        pms: getProjectManagersForIssue(issue),
                        pis: getPIsForIssue(issue),
                        extraProperties: extraProperties,
                        requestContextPath: request.contextPath
                ])
    }

}
