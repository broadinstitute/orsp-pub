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
class NotifyService implements SendgridSupport, Status  {

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
                recipients)

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

        Map<String, String> emailToDisplayNameMap = userService.findUsers(allRecipients).collectEntries {  [(it.emailAddress): it.displayName] }
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
                model: [to: toAddresses?.join(","),
                        from: fromAddress,
                        cc: ccAddresses?.join(","),
                        bcc: bccAddresses?.join(","),
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
            List<String> recipients) {
        if (issue.isFlagSet(IssueExtraProperty.ORSP_ENTERED_FLAG)) {
            details +=
                    "This project is only being sent to ORSP because it has been entered by ORSP. " +
                    "Normally, the recipients would have been: " + recipients?.join(", ")
        }
        String content = groovyPageRenderer.render(
                view: view,
                model: [user: user,
                        issue: issue,
                        comment: comment,
                        details: details,
                        issueLink: issueLink])
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
                response.success {resp, json ->
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
        }
        else if (statusMap.values.every { it.healthy }) {
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

}