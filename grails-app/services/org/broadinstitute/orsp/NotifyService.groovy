package org.broadinstitute.orsp

import grails.gsp.PageRenderer
import grails.util.Environment
import grails.web.mapping.LinkGenerator
import groovy.util.logging.Slf4j
import groovyx.net.http.HttpBuilder
import org.broadinstitute.orsp.config.NotifyConfiguration
import org.broadinstitute.orsp.sendgrid.Mail
import org.broadinstitute.orsp.sendgrid.SendgridSupport
import org.springframework.http.MediaType

@Slf4j
class NotifyService implements SendgridSupport, Status {

    public static final String ORSP_ADDRESS = "orsp-portal@broadinstitute.org"
    public static final String YES = "Yes"
    public static final String UNCERTAIN = "Uncertain"
    public static final String TEXT_SHARING_BOTH = "both"
    public static final String TEXT_SHARING_OPEN = "open"
    private static final String APPROVED ="Approved"
    private static final String CLOSED = "Closed"
    private static final String DISAPPROVED = "Disapproved"

    PageRenderer groovyPageRenderer
    LinkGenerator grailsLinkGenerator
    UserService userService
    NotifyConfiguration notifyConfiguration

    String getDefaultRecipient() {
        notifyConfiguration.defaultRecipient
    }

    String getDefaultFromAddress() {
        notifyConfiguration.fromAddress
    }

    List<String> getOrspSpecialRecipients() {
        new ArrayList<String>(notifyConfiguration.orspSpecialRecipients)
    }

    List<String> getBccRecipients() {
        new ArrayList<String>(notifyConfiguration.bccRecipients)
    }

    String getReplyToRecipient() {
        notifyConfiguration.replyToRecipient
    }

    String getSendGridUrl() {
        notifyConfiguration.sendGridUrl
    }

    String getApiKey() {
        notifyConfiguration.apiKey
    }

    String getSendGridStatusUrl() {
        notifyConfiguration.sendGridStatusUrl
    }

    String getAdminRecipient() {
        notifyConfiguration.adminRecipient
    }

    String getSecurityRecipient() {
        notifyConfiguration.securityRecipient
    }

    String getAgreementsRecipient() {
        notifyConfiguration.agreementsRecipient
    }

    String getConflictOfInterestRecipient() {
        notifyConfiguration.conflictOfInterestRecipient
    }

    /**
     * Utility method to remove ORSP from recipients and if it is there, swap it out for the email addresses
     * of the individual team members. The full ORSP email address is used as the address of an RT group so we don't
     * want to use that any longer. Legacy data contains the actor name of "orsp" which ends up getting translated
     * into the full ORSP email address, so we hook into that here.
     *
     * @param recipients Unfiltered recipients
     * @return Filtered, unique list of recipients
     */
    private List<String> filterRecipients(Collection<String> recipients) {
        if (recipients?.contains(ORSP_ADDRESS)) {
            recipients -= ORSP_ADDRESS
            recipients += getOrspSpecialRecipients()
        }
        if (recipients != null) {
            recipients.toSet()
            recipients -= null
            recipients.toList()
        } else {
            Collections.emptyList()
        }
    }

    /**
     * Generate a direct link to the display view of the issue:
     *
     * @param issue The issue
     * @return The full url for the issue display
     */
    private String getShowIssueLink(Issue issue) {
        return issue.type == IssueType.CONSENT_GROUP.name ?
             grailsLinkGenerator.link(
                controller: "newConsentGroup",
                action: "main",
                params: [consentKey: issue.projectKey],
                absolute: true) :
                grailsLinkGenerator.link(
                        controller: "project",
                        action: "main",
                        params: [projectKey: issue.projectKey],
                        absolute: true)
    }

    /**
     * Generate a direct link to the consent group tab view
     *
     * @param issue The issue
     * @return The full url for the consent groups tab
     */
    private getCollectionLink(Issue issue) {
        return  grailsLinkGenerator.link(
                controller: "project",
                action: "main",
                params: [projectKey: issue.projectKey, tab: "consent-groups"],
                absolute: true)
    }

    /**
     * Primary method to create a message populated with addresses and subject
     *
     * @return MimeMessage
     */
    private Mail populateMailFromArguments(NotifyArguments arguments) {
        if (!arguments.issue) {
            throw new IllegalArgumentException("'Issue' is required")
        }
        if (!arguments.user) {
            throw new IllegalArgumentException("'User' is required")
        }
        if (!arguments.subject) {
            throw new IllegalArgumentException("'Subject' field is required")
        }

        // Debugging to sort out if messages are being sent correctly
        if (Environment.getCurrent() == Environment.PRODUCTION) {
            log.info("Populating message, project: " + arguments.issue?.projectKey)
            log.info("Populating message, view: " + arguments.view)
            log.info("Populating message, subject: " + arguments.subject)
            log.info("Populating message, to: " + arguments.toAddresses?.join(", "))
            log.info("Populating message, cc: " + arguments.ccAddresses?.join(", "))
            log.info("Populating message, from: " + arguments.fromAddress)
        }

        if (!arguments.toAddresses) {
            log.error("To Field was not populated for ${arguments.issue.projectKey}, defaulting to default recipients")
            arguments.setToAddresses(Collections.singletonList(getDefaultRecipient()))
        }

        List<String> recipients = filterRecipients(arguments.toAddresses)
        List<String> ccRecipients = filterRecipients(arguments.ccAddresses)
        List<String> bccRecipients = filterRecipients(getBccRecipients())
        String fromAddress = arguments.fromAddress ?: getDefaultFromAddress()

        String content = generateMessageContent(
                arguments.view ?: "/notify/transition",
                arguments.issue,
                arguments.user,
                arguments.values?.containsKey("isLink") ? getCollectionLink(arguments.issue) : getShowIssueLink(arguments.issue),
                arguments.comment,
                arguments.details,
                recipients,
                arguments.values,
                arguments.oldProjectkey)

        // If entered by ORSP, then all email should only go to the ORSP team
        if (arguments.issue.isFlagSet(IssueExtraProperty.ORSP_ENTERED_FLAG)) {
            recipients?.clear()
            recipients.addAll(getOrspSpecialRecipients())
            ccRecipients?.clear()
            bccRecipients?.clear()
        }

        // Query our user system so we can look up user display names for use in email messages.
        Collection<String> allRecipients = recipients + ccRecipients + bccRecipients
        allRecipients.addAll([fromAddress, replyToRecipient])
        allRecipients.flatten().unique() - null

        // Debugging to sort out if messages are being sent correctly
        if (Environment.getCurrent() == Environment.PRODUCTION) {
            log.info("Sending populated message to: " + allRecipients.join(", "))
        }

        // For all non-production email, modify it to send to the test group
        // This is dependent upon the environment configurations for this class.
        if (Environment.getCurrent() != Environment.PRODUCTION) {
            log.debug("Originally sending message to: " + allRecipients.join(","))
            log.debug("Now sending message to: " + getDefaultRecipient())
            arguments.subject = "[TEST] " + arguments.subject
            content = getTestSystemContent(arguments.subject, recipients, ccRecipients, bccRecipients, fromAddress, replyToRecipient) + content
            recipients?.clear()
            recipients.add(getDefaultRecipient())
            ccRecipients?.clear()
            bccRecipients?.clear()
            fromAddress = getDefaultFromAddress()
            allRecipients?.clear()
            allRecipients.add(getDefaultRecipient())
        }

        Map<String, String> emailToDisplayNameMap = userService.findUsers(allRecipients).collectEntries {
            [(it.emailAddress): it.displayName]
        }
        Mail mail = generateEmailMessage(
                arguments.subject,
                recipients,
                ccRecipients,
                bccRecipients,
                fromAddress,
                getReplyToRecipient(),
                content,
                emailToDisplayNameMap
        )
        mail
    }

    /**
     * Modify the message content with debugging information for when the message is sent out by a non-production
     * server. Used to display what the original content would have been had the message been sent by a production
     * server.
     *
     * @return Modified version of the message content
     */
    private String getTestSystemContent(
            String subject,
            List<String> toAddresses,
            List<String> ccAddresses,
            List<String> bccAddresses,
            String fromAddress,
            String replyTo) {
        groovyPageRenderer.render(
                template: "/notify/originalHeaders",
                model: [to     : toAddresses?.join(","),
                        from   : fromAddress,
                        cc     : ccAddresses?.join(","),
                        bcc    : bccAddresses?.join(","),
                        replyTo: replyTo,
                        subject: subject])
    }

    /*
     * Populate the provided view with content.
     */

    private String generateMessageContent(
            String view,
            Issue issue,
            User user,
            String issueLink,
            String comment,
            String details,
            List<String> recipients,
            Map<String, String> values,
            String oldProjectkey) {
        if (issue.isFlagSet(IssueExtraProperty.ORSP_ENTERED_FLAG)) {
            details +=
                    "This project is only being sent to ORSP because it has been entered by ORSP. " +
                            "Normally, the recipients would have been: " + recipients?.join(", ")
        }
        String content = groovyPageRenderer.render(
                view: view,
                model: [user     : user,
                        issue    : issue,
                        comment  : comment,
                        details  : details,
                        issueLink: issueLink,
                        values   : values,
                        oldProjectkey: oldProjectkey])
        content
    }

    /**
     * Call Sendgrid's status page:
     * curl -H "Accept: application/json"  http://status.sendgrid.com/ | jq .components
     * @return
     */
    SubsystemStatus getStatus() {
        String statusUrl = getSendGridStatusUrl()
        HttpBuilder http = HttpBuilder.configure {
            request.uri = statusUrl
            request.contentType = MediaType.APPLICATION_JSON_VALUE
            request.headers['Accept'] = MediaType.APPLICATION_JSON_VALUE
        }
        Map<String, SendgridSubsystem> statusMap = new HashMap<>()
        try {
            http.get() {
                response.success { resp, json ->
                    json.components?.each {
                        SendgridSubsystem subsystem =
                                new SendgridSubsystem(
                                        ok: it.status?.equalsIgnoreCase("operational"),
                                        status: it.status,
                                        name: it.name)
                        statusMap.put(subsystem.name, subsystem)
                    }
                }
            }
        } catch (Exception e) {
            log.error("Encountered exception: ${e.message}")
        }
        if (statusMap.isEmpty()) {
            new SubsystemStatus(ok: false, messages: ["No status available from Notifications Service"])
        } else if (statusMap.values.every { it.healthy }) {
            new SubsystemStatus(ok: true)
        } else {
            new SubsystemStatus(ok: false, messages: statusMap.values*.name)
        }
    }

    /**
     * Send message corresponding to the case where IRB supporting documents and application are accepted
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendIrbBothAccepted(NotifyArguments arguments) {
        arguments.view = "/notify/irb/bothAccepted"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    /**
     * Send message corresponding to the case where IRB supporting documents is accepted
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendIrbSupportAccepted(NotifyArguments arguments) {
        arguments.view = "/notify/irb/supportAccepted"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    /**
     * Send message corresponding to the case where non-IRB projects require CCO approval
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendNonIrbCcoReview(NotifyArguments arguments) {
        arguments.view = "/notify/non-irb/ccoReview"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    /**
     * Send message corresponding to the case where IRB projects have been approved by the IRB
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendIrbApprove(NotifyArguments arguments) {
        arguments.view = "/notify/irbApprove"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    /**
     * Send message corresponding to the case where IRB requests modification to the project
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendIrbModRequested(NotifyArguments arguments) {
        arguments.view = "/notify/irb/irbModRequested"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    /**
     * Send message corresponding to the case where ORSP requests modification to the project
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendRequestModification(NotifyArguments arguments) {
        arguments.view = "/notify/requestMod"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    /**
     * Send message corresponding to the case where ORSP makes a determination for the NE project
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendNotEngagedDetermination(NotifyArguments arguments) {
        arguments.view = "/notify/non-irb/neDetermination"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    /**
     * Send message corresponding to the case where ORSP makes a determination for the NHSR project
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendNHSRDetermination(NotifyArguments arguments) {
        arguments.view = "/notify/non-irb/nhsrDetermination"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    /**
     * Send message corresponding to the case where a PM submits an application to ORSP
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendApplicationSubmit(NotifyArguments arguments) {
        arguments.view = "/notify/submit"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    /**
     * Send message corresponding to the case where a PM submits an application to ORSP
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendSupportingDocumentsSubmit(NotifyArguments arguments) {
        arguments.view = "/notify/irb/supportSubmit"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    /**
     * Send a comment to the appropriate users
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendComment(NotifyArguments arguments) {
        arguments.view = "/notify/comment"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    /**
     * Send a request of clarification to the appropriate users
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendClarificationRequest(NotifyArguments arguments) {
        arguments.view = "/notify/clarificationRequest"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    /**
     * Send a Closed message
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendClosed(NotifyArguments arguments) {
        arguments.view = "/notify/closed"
        arguments.subject = "Closed: " + arguments.issue.projectKey
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    /**
     * Send a Withdrawn/Abandon message
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendWithdrawn(NotifyArguments arguments) {
        arguments.view = "/notify/withdrawn"
        arguments.subject = "Withdrawn: " + arguments.issue.projectKey
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }


    /**
     * Send message to security team with all the questions and answers where the user answered
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendSecurityInfo(Issue issue, User user, ConsentCollectionLink consentCollectionLink, String subjectDisplayName) {
        Map<Boolean, String> result = new HashMap<>()
        Boolean sendEmail = false
        if (getValue(consentCollectionLink.getPii()) == YES ||
                getValue(consentCollectionLink.getCompliance()) == YES ||
                getValue(consentCollectionLink.getPubliclyAvailable()) == YES) {
            sendEmail = true
        }
        if (sendEmail) {
            NotifyArguments arguments = new NotifyArguments(
                    toAddresses: Collections.singletonList(getSecurityRecipient()),
                    fromAddress: getDefaultFromAddress(),
                    subject: subjectDisplayName + " added " + issue.projectKey + " - Required InfoSec Follow-up",
                    user: user,
                    issue: issue)
            arguments.view = "/notify/generalInfo"
            Mail mail = populateMailFromArguments(arguments)
            result = sendMail(mail, getApiKey(), getSendGridUrl())
        }
        result
    }

    /**
     * Send message to the user and cc’ing Agreements@ which provides requirements
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendRequirementsInfo(Issue issue, User user, String type) {
        Map<String, String> values = new HashMap<>()
        Map<Boolean, String> result = new HashMap<>()

        if (type != ProjectCGTypes.PROJECT.name && issue.getFeeForService() != null && Boolean.valueOf(issue.getFeeForService())) {
            values.put(IssueExtraProperty.FEE_FOR_SERVICE, "true")
        }
        else if (issue.getFeeForServiceWork() != null && Boolean.valueOf(issue.getFeeForServiceWork())){
            values.put(IssueExtraProperty.FEE_FOR_SERVICE, "true")
        }

        values.put('type', type)

        if (values.size() >= 2) {
            NotifyArguments arguments =
                    new NotifyArguments(
                            toAddresses: Collections.singletonList(user.getEmailAddress()),
                            fromAddress: getDefaultFromAddress(),
                            ccAddresses: Collections.singletonList(getAgreementsRecipient()),
                            subject: issue.projectKey + " - Required OSAP Follow-up",
                            user: user,
                            issue: issue,
                            values: values)
            arguments.view = "/notify/requirements"
            Mail mail = populateMailFromArguments(arguments)
            result = sendMail(mail, getApiKey(), getSendGridUrl())
        }
        result
    }

    /**
     * Send message to admins when a Sample/Data Cohort (or consent group) is created/added in a Project
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendAdminNotification(String type, Issue issue) {
        User user = userService.findUser(issue.reporter)
        NotifyArguments arguments =
                new NotifyArguments(
                        toAddresses: Collections.singletonList(getAdminRecipient()),
                        fromAddress: getDefaultFromAddress(),
                        subject: user.displayName + " created " + issue.projectKey + " - Your ORSP Review is Required",
                        details: type,
                        user: user,
                        issue: issue)
        arguments.view = "/notify/creation"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    /**
     * Send message to user when a Sample/Data Cohort is submitted to IRB
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */

    Map<Boolean, String> sendAdminNotificationforIRB(String type, String projectKey, String consentKey) {
        Issue consent = Issue.findByProjectKey(consentKey);
        log.info("\nconsent:" + consent);
        log.info("\nissueLinkConsent" + issueLink);
        Issue issue = Issue.findByProjectKey(projectKey);
        log.info("\nissueLinkProject" + issueLink);
        User user = userService.findUser(issue.reporter)
        NotifyArguments arguments =
                new NotifyArguments(
                        toAddresses: Collections.singletonList(user.emailAddress),
                        fromAddress: getDefaultFromAddress(),
                        ccAddresses: Collections.singletonList(getAdminRecipient()),
                        subject: consentKey + " - Your " + type + ", added to " + issue.projectKey + " is now Pending IRB review",
                        details: type,
                        user: user,
                        issue: issue)
        arguments.view = "/notify/irbSubmit"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }


    /**
     * Send message to admins when project is created
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendProjectAdminNotification(String type, Issue issue) {
        User user = userService.findUser(issue.reporter)
        NotifyArguments arguments =
                new NotifyArguments(
                        toAddresses: Collections.singletonList(getAdminRecipient()),
                        fromAddress: getDefaultFromAddress(),
                        subject: user.displayName + " created " + issue.projectKey + " - Your ORSP Review is Required",
                        details: type,
                        user: user,
                        issue: issue)
        arguments.view = "/notify/createProject"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }



    Map<Boolean, String> sendApprovedNotification(Issue issue, String sessionUsername) {
        Collection<User> usersToNotify = userService.findUsers(issue.getPMs())
        Collection<String> emails = usersToNotify.emailAddress
        NotifyArguments arguments = new NotifyArguments(
                toAddresses: emails,
                fromAddress: getDefaultFromAddress(),
                ccAddresses: Collections.singletonList(getAdminRecipient()),
                subject: issue.projectKey + " - Your ORSP submission has been approved by " + sessionUsername,
                issue: issue,
                user:  userService.findUser(issue.reporter)
        )
        arguments.view = "/notify/approval"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    Map<Boolean, String> sendRejectionProjectNotification(Issue issue, String sessionUsername) {
        Collection<User> usersToNotify = userService.findUsers(issue.getPMs())
        Collection<String> emails = usersToNotify.emailAddress
        NotifyArguments arguments = new NotifyArguments(
                toAddresses: emails,
                fromAddress: getDefaultFromAddress(),
                ccAddresses: Collections.singletonList(getAdminRecipient()),
                subject: issue.projectKey + " - Your ORSP submission has been disapproved by " + sessionUsername,
                issue: issue,
                user:  userService.findUser(issue.reporter)
        )
        arguments.view = "/notify/rejection"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    Map<Boolean, String> sendClosedProjectNotification(Issue issue) {
        Collection<User> usersToNotify = userService.findUsers(issue.getPMs())
        Collection<String> emails = usersToNotify.emailAddress
        NotifyArguments arguments = new NotifyArguments(
                toAddresses: emails,
                fromAddress: getDefaultFromAddress(),
                ccAddresses: [],
                subject: "Closed: " + issue.projectKey,
                issue: issue,
                user:  userService.findUser(issue.reporter)
        )
        sendClosed(arguments)
    }

    def sendProjectStatusNotification(String type, Issue issue, String sessionUsername) {
        if (type?.equals(APPROVED)) {
            sendApprovedNotification(issue, sessionUsername)
        } else if (type?.equals(DISAPPROVED)) {
            sendRejectionProjectNotification(issue, sessionUsername)
        } else if (type?.equals(CLOSED)) {
            sendClosedProjectNotification(issue)
        }
    }

    private String getValue(String value) {
        String result = "Uncertain"
        if (value == "false") {
            result = "No"
        } else if (value == "true") {
            result = "Yes"
        }
        result
    }

    Map<Boolean, String> sendEditsSubmissionNotification(Issue issue, User user) {
        NotifyArguments arguments =
                new NotifyArguments(
                        toAddresses: Collections.singletonList(getAdminRecipient()),
                        fromAddress: getDefaultFromAddress(),
                        subject: user.displayName + " edited " + issue.projectKey + " - Your ORSP Review is Required",
                        user: userService.findUser(issue.reporter),
                        issue: issue)

        arguments.view = "/notify/edits"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    Map<Boolean, String> sendEditsApprovedNotification(Issue issue, String editCreatorName, String sessionUsername) {
        String type = issue.type.equals(IssueType.CONSENT_GROUP.getName()) ? "Sample/Data Cohort" : "Project"
        User user = userService.findUser(issue.reporter)
        NotifyArguments arguments =
                new NotifyArguments(
                        toAddresses: Collections.singletonList(user.emailAddress),
                        ccAddresses: editCreatorName != null ? Collections.singletonList(userService.findUser(editCreatorName).emailAddress) : Collections.emptyList(),
                        fromAddress: getDefaultFromAddress(),
                        subject: issue.projectKey + " - Your edits to this ORSP " + type + " have been approved by " + sessionUsername,
                        user: user,
                        issue: issue)

        arguments.view = "/notify/editsApproved"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    Map<Boolean, String> sendDeterminationRevisedNotification(Issue issue, String editCreatorName, String oldProjectKey) {
        User user = userService.findUser(issue.reporter)
        NotifyArguments arguments =
                new NotifyArguments(
                        toAddresses: Collections.singletonList(user.emailAddress),
                        ccAddresses: editCreatorName != null ? Collections.singletonList(userService.findUser(editCreatorName).emailAddress) : Collections.emptyList(),
                        fromAddress: getDefaultFromAddress(),
                        subject: "ORSP has revised your project determination",
                        user: user,
                        issue: issue)

        arguments.view = "/notify/determinationRevised"
        arguments.oldProjectkey = oldProjectKey
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    Map<Boolean, String> sendEditsDisapprovedNotification(Issue issue, String editCreatorName, String sessionUsername) {
        String type = issue.type?.equals(IssueType.CONSENT_GROUP.getName()) ? "Sample/Data Cohort" : "Project"
        User user = userService.findUser(issue.reporter)
        NotifyArguments arguments =
                new NotifyArguments(
                        toAddresses: Collections.singletonList(user.emailAddress),
                        ccAddresses: editCreatorName != null ? Collections.singletonList(userService.findUser(editCreatorName).emailAddress) : Collections.emptyList(),
                        fromAddress: getDefaultFromAddress(),
                        subject: issue.projectKey + " - Your edits to this ORSP " + type + " have been disapproved by" + sessionUsername,
                        user: user,
                        issue: issue)

        arguments.view = "/notify/editsDisapproved"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    Map<Boolean, String> sendDulFormLinkNotification(NotifyArguments arguments) {
        arguments.view = "/notify/dulFormLink"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    Map<Boolean, String> sendDulSubmitNotification(Issue issue) {
        User user = userService.findUser(issue.reporter)
        NotifyArguments arguments =
                new NotifyArguments(
                        toAddresses: Collections.singletonList(getDefaultRecipient()),
                        ccAddresses: [],
                        fromAddress: getDefaultFromAddress(),
                        subject: issue.projectKey + " - A Data Use Letter has been generated",
                        user: user,
                        issue: issue)
        arguments.view = "/notify/dulSubmit"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }


    Map<Boolean, String> consentGroupCreation(Issue issue, ConsentCollectionLink consentCollectionLink) {
        User user = userService.findUser(issue.reporter)
        sendAdminNotification(IssueType.SAMPLE_DATA_COHORTS.name, issue)
        sendSecurityInfo(issue, user, consentCollectionLink, user.displayName)
    }

    Map<Boolean, String> projectCreation(Issue issue) {
        User user = userService.findUser(issue.reporter)
        sendProjectAdminNotification(ProjectCGTypes.PROJECT.name, issue)
        sendApplicationSubmit(
                new NotifyArguments(
                        toAddresses:  [user?.emailAddress],
                        fromAddress: getDefaultFromAddress(),
                        ccAddresses: [],
                        subject: "Project Submission Received by ORSP: " + issue.projectKey,
                        issue: issue,
                        user: user
                )
        )
    }

    void notifyOrganizationsMatch(String projectKey, String matches) {
        Issue project = Issue.findByProjectKey(projectKey)
        User user = userService.findUser(project.reporter)
        NotifyArguments arguments =
                new NotifyArguments(
                        toAddresses: Collections.singletonList(getAdminRecipient()),
                        ccAddresses: Collections.singletonList(getConflictOfInterestRecipient()),
                        fromAddress: getDefaultFromAddress(),
                        subject: "ALERT - Potential iCOI identified",
                        user: user,
                        issue: project,
                        details: matches)

        arguments.view = "/notify/organizationsMatch"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    Map<Boolean, String> sendApproveRejectLinkNotification(String projectKey, String consentKey, boolean isApproved, String sessionUsername) {
        Map<String, String> values = new HashMap<>()
        Issue project = Issue.findByProjectKey(projectKey)
        Issue consent = Issue.findByProjectKey(consentKey)
        values.put("projectLink", getShowIssueLink(project))
        values.put("projectSummary", project.summary)
        User user = userService.findUser(project.reporter)
        NotifyArguments arguments =
                new NotifyArguments(
                        toAddresses: getUserApplicantSubmitter(project, consent),
                        ccAddresses: [],
                        fromAddress: getDefaultFromAddress(),
                        subject: consent.projectKey + " - Your ORSP Sample/Data Cohort added to " +
                                project.projectKey + (isApproved ? " has been approved" : " has been disapproved")
                                + " by " + sessionUsername,
                        user: user,
                        issue: consent,
                        values: values)

        arguments.view = isApproved ? "/notify/approveLink" : "/notify/rejectLink"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    List<String> getUserApplicantSubmitter(Issue project, Issue consent) {
        Set<String> toAddresses = new HashSet<>()
        toAddresses.addAll(userService.findUser(project.getReporter())?.collect {it.emailAddress})
        toAddresses.addAll(userService.findUser(consent.getReporter())?.collect {it.emailAddress})
        toAddresses.addAll(getAdminRecipient())
        List<String> mails = new ArrayList<>()
        mails.addAll(toAddresses)
        mails
    }

    Map<Boolean, String> sendAddedCGToProjectNotification(String consentKey, String projectKey, ConsentCollectionLink consentCollectionLink, String subjectDisplayName) {
        Map<String, String> values = new HashMap<>()
        Issue consent = Issue.findByProjectKey(consentKey)
        Issue project = Issue.findByProjectKey(projectKey)
        User user = userService.findUser(consent.reporter)
        values.put("projectLink", getShowIssueLink(project))
        values.put("projectSummary", project.summary)
        NotifyArguments arguments =
                new NotifyArguments(
                        toAddresses: Collections.singletonList(getAdminRecipient()),
                        fromAddress: getDefaultFromAddress(),
                        subject: subjectDisplayName + " added " + consent.projectKey + " - Your ORSP Review is Required",
                        user: user,
                        issue: consent,
                        values: values)

        arguments.view = "/notify/addExistingCG"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
        sendSecurityInfo(consent, user, consentCollectionLink, subjectDisplayName)
    }
}
