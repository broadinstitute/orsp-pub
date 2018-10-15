package org.broadinstitute.orsp

import grails.converters.JSON
import org.springframework.web.multipart.MultipartFile

/**
 * extend BaseController with actions specific to IRB projects.
 */
class IrbController extends AuthenticatedController {

    public static final List<String> ATTACHMENT_DOC_TYPES =
            ["Draft IRB Application",
             "Final IRB Application",
             "Broad's IRB approval",
             "Other"]

    // TODO: Look into handling this better. The templates are tied to issue status and determine
    // which gsp template to show in a particular tab. I don't like handling this at the controller
    // level and would like to see this kind of view-specific logic moved closer to the view page.
    public static final Map<String, String> IRB_STATUS_TEMPLATES =
            ["preparing application": "prepApplication",
             "getting signatures": "signatures",
             "irb considering": "irbResult",
             "approved": "approved"]

    @Override
    String getType() { IssueType.IRB.controller }

    @Override
    boolean isProject() {
        true
    }

    @Override
    handleIntake(String key) {
        Issue issue = queryService.findByKey(key)
        Collection<User> actors = getProjectManagersForIssue(issue)
        transitionService.handleIntake(issue, actors*.userName, IssueStatus.PreparingApplication.name, getUser()?.displayName)
    }

    @Override
    create() {
        Issue issue = queryService.findByKey(params.id)
        [issue: issue]
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
        Collection<Submission> submissions = queryService.getSubmissionsByProject(issue.projectKey)
        Map<String, List<Submission>> groupedSubmissions = groupSubmissions(issue, submissions)
        Collection<StorageDocument> storageDocuments = queryService.getDocumentsForProject(issue.projectKey)

        [issue             : issue,
         pms               : getProjectManagersForIssue(issue),
         pis               : getPIsForIssue(issue),
         workspaceTemplate : IRB_STATUS_TEMPLATES.get(issue?.status?.toLowerCase(), ""),
         extraProperties   : issue.getExtraProperties(),
         isProject         : true,
         attachmentTypes   : ATTACHMENT_DOC_TYPES,
         tab               : params.tab,
         amendmentTypes    : SUBMISSION_DOC_TYPES,
         storageDocuments  : storageDocuments,
         groupedSubmissions: groupedSubmissions
        ]
    }

    def attachDocument() {
        def issue = queryService.findByKey(params.id)
        try {
            if (request.multiFileMap?.files) {
                storageProviderService.saveMultipartFiles(
                        (String) getUser()?.displayName,
                        (String) getUser()?.userName,
                        (String) issue.projectKey,
                        (String) params.type,
                        (Collection<MultipartFile>) request.multiFileMap.files)
            }
            redirect(controller: 'irb', action: "show", params: [id: issue.projectKey, tab: 'documents'])
        } catch (Exception e) {
            render([status: 500, text: [error: e.message] as JSON])
        }
    }

    /**
     * Handles the case where ORSP requests modification to the application
     *
     * @return View
     */
    def appModify() {
        def issue = queryService.findByKey(params.id)
        Collection<User> actors = getProjectManagersForIssue(issue)
        transitionService.appModify(issue, actors*.userName, params.comment, getUser()?.displayName)
        notifyService.sendRequestModification(
                new NotifyArguments(
                        toAddresses: actors?.collect {it.emailAddress},
                        subject: "ORSP Requests Modification to: " + issue.projectKey,
                        comment: params.comment,
                        user: getUser(),
                        issue: issue
                )
        )
        redirect(action: "show", id: issue.projectKey)
    }

    /**
     * Handles the case where ORSP requests modification to the supporting documents
     *
     * @return View
     */
    def supportModify() {
        def issue = queryService.findByKey(params.id)
        Collection<User> actors = getProjectManagersForIssue(issue)
        transitionService.supportModify(issue, actors*.userName, params.comment, getUser()?.displayName)
        notifyService.sendRequestModification(
                new NotifyArguments(
                        toAddresses: actors?.collect {it.emailAddress},
                        subject: "ORSP Requests Modification to: " + issue.projectKey,
                        comment: params.comment,
                        user: getUser(),
                        issue: issue
                )
        )
        redirect(action: "show", id: issue.projectKey)
    }

    /**
     * Handle the complex case where IRB project is accepted by ORSP.
     *
     * If the project has both application ('app') and supporting ('support') documents accepted, then the project is
     * ready for CCO signature.
     *
     * Otherwise, the project does not move forward and still needs either 'app' or 'support' acceptance.
     *
     * @return Redirect
     */
    def supportAccept() {
        def issue = queryService.findByKey(params.id)
        Collection<User> actors = getProjectManagersForIssue(issue)
        transitionService.supportAccept(issue, actors*.userName, params.comment, getUser()?.displayName)
        // Refresh the issue
        issue = queryService.findByKey(issue.projectKey)
        if (issue.isFlagSet(IssueExtraProperty.APP_ACCEPTED_FLAG)) {
            notifyService.sendIrbBothAccepted(
                    new NotifyArguments(
                            toAddresses: actors?.collect {it.emailAddress},
                            subject: "IRB Application Ready for Submission: " + issue.projectKey,
                            comment: params.comment,
                            user: getUser(),
                            issue: issue
                    )
            )
            redirect([action: "show", id: issue.projectKey])
        } else {
            notifyService.sendIrbSupportAccepted(
                    new NotifyArguments(
                            toAddresses: actors?.collect {it.emailAddress},
                            subject: "IRB Supporting Documents are Adequate: " + issue.projectKey,
                            comment: params.comment,
                            user: getUser(),
                            issue: issue
                    )
            )
            redirect(action: "show", id: issue.projectKey)
        }

    }

    /**
     * Handle the case where the project manager is submitting an application to ORSP.
     *
     * @return View
     */
    def appSubmit() {
        def issue = queryService.findByKey(params.id)
        transitionService.appSubmit(issue, params.comment, getUser()?.displayName)
        notifyService.sendApplicationSubmit(
                new NotifyArguments(
                        toAddresses: notifyService.getOrspSpecialRecipients(),
                        fromAddress: getUser()?.emailAddress,
                        ccAddresses: [getUser()?.emailAddress],
                        subject: "Project Submission Received by ORSP: " + issue.projectKey,
                        issue: issue,
                        user: getUser(),
                        comment: params.comment
                )
        )
        redirect(action: "show", id: issue.projectKey)

    }

    /**
     * Handle the case where the project manager is submitting supporting documents to ORSP.
     *
     * @return View
     */
    def supportSubmit() {
        def issue = queryService.findByKey(params.id)
        transitionService.supportSubmit(issue, params.comment, getUser()?.displayName)
        notifyService.sendSupportingDocumentsSubmit(
                new NotifyArguments(
                        toAddresses: notifyService.getOrspSpecialRecipients(),
                        fromAddress: getUser()?.emailAddress,
                        ccAddresses: [(String) getUser()?.emailAddress],
                        subject: "Project Submission Received by ORSP: " + issue.projectKey,
                        issue: issue,
                        user: getUser(),
                        comment: params.comment
                )
        )
        redirect(action: "show", id: issue.projectKey)
    }

    /**
     * Handle the case where ORSP is accepting the application.
     *
     * @return View
     */
    def appAccept() {
        def issue = queryService.findByKey(params.id)
        Collection<User> actors = getProjectManagersForIssue(issue)
        transitionService.appAccept(issue, actors*.userName, params.comment, getUser()?.displayName)

        if (issue.isFlagSet(IssueExtraProperty.SUPPORT_ACCEPTED_FLAG)) {
            notifyService.sendIrbBothAccepted(
                    new NotifyArguments(
                            toAddresses: actors?.collect {it.emailAddress},
                            subject: "IRB Application Ready for Submission: " + issue.projectKey,
                            comment: params.comment,
                            user: getUser(),
                            issue: issue
                    )
            )
            redirect([action: "show", id: params.id])
        } else {
            notifyService.sendIrbSupportAccepted(
                    new NotifyArguments(
                            toAddresses: actors?.collect {it.emailAddress},
                            subject: "ORSP Project Requires Your Review: " + issue.projectKey,
                            comment: params.comment,
                            user: getUser(),
                            issue: issue
                    )
            )
            redirect(action: "show", id: issue.projectKey)
        }

    }

    def appSigned() {
        def issue = queryService.findByKey(params.id)
        transitionService.appSigned(issue, getUser()?.displayName)
        redirect([action: "show", id: params.id])
    }

    def irbApprove() {
        def issue = queryService.findByKey(params.id)
        transitionService.irbApprove(issue, params.comment, getUser()?.displayName)
        Collection<User> actors = getProjectManagersForIssue(issue)
        notifyService.sendIrbApprove(
                new NotifyArguments(
                        toAddresses: actors?.collect {it.emailAddress},
                        subject: "Protocol Approval by IRB: " + issue.projectKey,
                        issue: issue,
                        user: getUser(),
                        comment: params.comment
                )
        )

        redirect([action: "show", id: params.id])
    }

    def irbRequestMod() {
        def issue = queryService.findByKey(params.id)
        def pms = getProjectManagersForIssue(issue)
        transitionService.irbRequestMod(issue, pms*.userName, params.comment, getUser()?.displayName)
        def recipients = pms.collect{it.emailAddress} + "orsp-portal@broadinstitute.org"
        notifyService.sendIrbModRequested(
                new NotifyArguments(
                        view: "/notify/irb/irbModRequested",
                        toAddresses: recipients,
                        subject: "IRB Requests Modification for ${issue.projectKey}: '${issue.summary}'",
                        issue: issue,
                        user: getUser()
                )
        )
        redirect([action: "show", id: params.id])
    }

    @Override
    print() {
        Issue issue = queryService.findByKey(params.id)
        Collection<ConsentCollectionLink> collectionLinks = ConsentCollectionLink.findAllByProjectKey(issue.projectKey)
        Collection<IssueExtraProperty> extraProperties = issue.getExtraProperties()
        renderPdf(
                template: "/irb/print",
                model: [issue: issue,
                        pms: getProjectManagersForIssue(issue),
                        pis: getPIsForIssue(issue),
                        extraProperties: extraProperties,
                        collectionLinks: collectionLinks,
                        requestContextPath: request.contextPath
                ])
    }

}
