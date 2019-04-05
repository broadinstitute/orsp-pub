package org.broadinstitute.orsp

import grails.gsp.PageRenderer
import grails.util.Environment
import grails.web.mapping.LinkGenerator
import groovy.util.logging.Slf4j
import groovyx.net.http.HttpBuilder
import org.apache.commons.lang.StringUtils
import org.broadinstitute.orsp.config.NotifyConfiguration
import org.broadinstitute.orsp.sendgrid.Mail
import org.broadinstitute.orsp.sendgrid.SendgridSupport
import org.springframework.http.MediaType

@Slf4j
class NotifyService implements SendgridSupport, Status {

    public static final String ORSP_ADDRESS = "orsp-portal@broadinstitute.org"
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
        return grailsLinkGenerator.link(
                controller: issue.controller,
                action: "show",
                id: issue.projectKey,
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
                getShowIssueLink(arguments.issue),
                arguments.comment,
                arguments.details,
                recipients,
                arguments.values)

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
            Map<String, String> values) {
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
                        values   : values])
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
    Map<Boolean, String> sendSecurityInfo(Issue issue, User user, String type) {
        Map<String, String> values = new HashMap<>()
        values.put(IssueExtraProperty.PII, getValue(issue.getPII()))
        values.put(IssueExtraProperty.COMPLIANCE, getValue(issue.getCompliance()))
        values.put(IssueExtraProperty.SENSITIVE, getValue(issue.getSensitive()))
        values.put(IssueExtraProperty.SHARING_TYPE, getValue(issue.getSharingType()))
        if (StringUtils.isNotEmpty(issue.getTextSensitive()))
            values.put(IssueExtraProperty.TEXT_SENSITIVE, issue.getTextSensitive())
        if (StringUtils.isNotEmpty(issue.getTextCompliance()))
            values.put(IssueExtraProperty.TEXT_COMPLIANCE, issue.getTextCompliance())
        if (StringUtils.isNotEmpty(issue.getTextSharingType()))
            values.put(IssueExtraProperty.TEXT_SHARING_TYPE, issue.getTextSharingType())

        values.put('type', type)

        NotifyArguments arguments =
                new NotifyArguments(
                        toAddresses: Collections.singletonList(getSecurityRecipient()),
                        fromAddress: getDefaultFromAddress(),
                        ccAddresses: Collections.singletonList(user.getEmailAddress()),
                        subject: issue.projectKey + " - Required InfoSec Follow-up",
                        user: user,
                        issue: issue,
                        values: values)

        arguments.view = "/notify/generalInfo"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
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

        if (Boolean.valueOf(issue.getMTA())) {
            values.put(IssueExtraProperty.REQUIRE_MTA, "true")
        }
        if (type != ProjectCGTypes.PROJECT.name && issue.getFeeForService() != null && Boolean.valueOf(issue.getFeeForService())) {
            values.put(IssueExtraProperty.FEE_FOR_SERVICE, "true")
        }
        else if (issue.getFeeForServiceWork() != null && Boolean.valueOf(issue.getFeeForServiceWork())){
            values.put(IssueExtraProperty.FEE_FOR_SERVICE, "true")
        }
        else if (issue.areSamplesComingFromEEA() != null && !Boolean.valueOf(issue.areSamplesComingFromEEA())) {
            values.put(IssueExtraProperty.ARE_SAMPLES_COMING_FROM_EEAA, "true")
        }
        else if (issue.isCollaboratorProvidingGoodService() != null && Boolean.valueOf(issue.isCollaboratorProvidingGoodService())) {
            values.put(IssueExtraProperty.IS_COLLABORATOR_PROVIDING_GOOD_SERVICE, "true")
        }
        else if (issue.isConsentUnambiguous() != null && !Boolean.valueOf(issue.isConsentUnambiguous())) {
            values.put(IssueExtraProperty.IS_CONSENT_UNAMBIGUOUS, "true")
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
     * Send message to admins when project or consent group is created
     *
     * @param arguments NotifyArguments
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    def sendAdminNotification(String type, Issue issue) {
        NotifyArguments arguments =
                new NotifyArguments(
                        toAddresses: Collections.singletonList(getAdminRecipient()),
                        fromAddress: getDefaultFromAddress(),
                        subject: issue.projectKey + " - Your ORSP Review is Required",
                        details: type,
                        user: userService.findUser(issue.reporter),
                        issue: issue)
        arguments.view = "/notify/creation"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
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


    def sendDulFormLinkNotification(NotifyArguments arguments) {
        arguments.view = "/notify/dulFormLink"
        Mail mail = populateMailFromArguments(arguments)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }

    Map<Boolean, String> projectCGCreation(Issue issue) {
        String type = ''
        User user = userService.findUser(issue.reporter)
        if (issue.getType() == IssueType.CONSENT_GROUP.name) {
            type = IssueType.CONSENT_GROUP.name
        } else {
            type = ProjectCGTypes.PROJECT.name
        }
        sendAdminNotification(type, issue)
        sendRequirementsInfo(issue, user, type)
        sendSecurityInfo(issue, user, type)
    }
}
