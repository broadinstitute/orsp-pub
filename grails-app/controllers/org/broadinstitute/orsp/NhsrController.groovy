package org.broadinstitute.orsp

import groovy.util.logging.Slf4j

@Slf4j
class NhsrController extends NeController {

    @Override
    String getType() { IssueType.NHSR.controller }

    @Override
    create() {
        Issue issue = queryService.findByKey(params.id)
        [date : new Date(), issue: issue]
    }

    @Override
    edit() {
        Issue issue = queryService.findByKey(params.id)
        [issue          : issue,
         pms            : getProjectManagersForIssue(issue),
         pis            : getPIsForIssue(issue),
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
         attachmentTypes   : PROJECT_DOC_TYPES,
         tab               : params.tab,
         storageDocuments  : storageDocuments,
         groupedSubmissions: groupedSubmissions,
         attachmentsApproved: issue.attachmentsApproved(),
         projectReviewApproved: issue.getProjectReviewApproved()
        ]
    }

    /**
     * transition to "Complete"
     */
    @Override
    signed() {
        Issue issue = queryService.findByKey(params.id)
        transitionService.neComplete(issue, params.comment, getUser()?.displayName)
        Collection<User> actors = getProjectManagersForIssue(issue)
        notifyService.sendNHSRDetermination(
                new NotifyArguments(
                        toAddresses: actors?.collect {it.emailAddress},
                        subject: "Broad Determined to be Not Human Subjects Research: " + issue.projectKey,
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
                template: "/nhsr/print",
                model: [issue: issue,
                        pms: getProjectManagersForIssue(issue),
                        pis: getPIsForIssue(issue),
                        extraProperties: extraProperties,
                        requestContextPath: request.contextPath
                ])
    }

}
