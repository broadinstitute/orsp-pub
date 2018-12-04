package org.broadinstitute.orsp

import com.github.tomakehurst.wiremock.junit.WireMockRule
import grails.testing.mixin.integration.Integration
import groovy.util.logging.Slf4j
import org.junit.Rule
import org.springframework.beans.factory.annotation.Autowired
import spock.lang.Specification

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.anyUrl
import static com.github.tomakehurst.wiremock.client.WireMock.post
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig
import static org.junit.Assert.assertFalse
import static org.junit.Assert.assertNotNull
import static org.junit.Assert.assertTrue

@Slf4j
@Integration
class NotifyServiceSpec extends Specification {

    @Autowired
    NotifyService service

    private static User getUser() {
        new User(
                userName: "testUser",
                displayName: "Test User",
                emailAddress: "test.user@broadinstitute.org"
        )
    }

    private static Issue getIrbIssue() {
        new Issue(
                projectKey: "TEST-1234",
                type: IssueType.IRB.name
        )
    }

    private static Issue getNonIrbIssue() {
        new Issue(
                projectKey: "TEST-1234",
                type: IssueType.NHSR.name
        )
    }

    private void resetWireMock() {
        service.notifyConfiguration.sendGridUrl = "http://localhost:${wireMockRule.port()}/send"
        wireMockRule.resetAll()
        stubFor(post(anyUrl()).willReturn(aResponse().withStatus(200)))
    }

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(wireMockConfig().dynamicPort())

    void testConfiguration() {
        when:
        String sendGridUrl = service.getSendGridUrl()
        String apiKey = service.getApiKey()
        String fromAddress = service.getDefaultFromAddress()
        String defaultRecipient = service.getDefaultRecipient()
        List<String> specialRecipients = service.getOrspSpecialRecipients()
        List<String> bccRecipients = service.getBccRecipients()
        String replyToRecipient = service.getReplyToRecipient()

        then:
        assertNotNull(sendGridUrl)
        assertFalse(sendGridUrl.isEmpty())
        assertNotNull(apiKey)
        assertFalse(apiKey.isEmpty())
        assertNotNull(fromAddress)
        assertFalse(fromAddress.isEmpty())
        assertNotNull(defaultRecipient)
        assertFalse(defaultRecipient.isEmpty())
        assertNotNull(specialRecipients)
        assertFalse(specialRecipients.isEmpty())
        assertTrue(specialRecipients.contains("grushton@broadinstitute.org"))
        assertFalse(specialRecipients.contains("invalid@me.com"))
        assertNotNull(bccRecipients)
        assertFalse(bccRecipients.isEmpty())
        assertTrue(bccRecipients.contains("grushton@broadinstitute.org"))
        assertFalse(bccRecipients.contains("invalid@me.com"))
        assertNotNull(replyToRecipient)
        assertFalse(replyToRecipient.isEmpty())
    }

    void testSendIrbBothAccepted() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                toAddresses: [service.getDefaultRecipient()],
                subject: "IRB Application Ready for Submission: TEST-1234",
                comment: "Comment",
                user: getUser(),
                issue: getIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendIrbBothAccepted(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

    void testSendIrbSupportAccepted() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                toAddresses: [service.getDefaultRecipient()],
                subject: "IRB Supporting Documents are Adequate: TEST-1234",
                comment: "Comment",
                user: getUser(),
                issue: getIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendIrbSupportAccepted(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

    void testSendNonIrbCcoReview() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                toAddresses: SupplementalRole.CCO_USERS.collect { it + "@broadinstitute.org" },
                subject: "ORSP Project Requires Your review: TEST-1234",
                comment: "Comment",
                user: getUser(),
                issue: getNonIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendNonIrbCcoReview(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

    void testSendIrbApprove() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                toAddresses: [service.getDefaultRecipient()],
                subject: "Protocol Approval by IRB: TEST-1234",
                comment: "Comment",
                user: getUser(),
                issue: getIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendIrbApprove(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

    void testSendIrbModRequested() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                view: "/notify/irb/irbModRequested",
                toAddresses: [service.getDefaultRecipient()],
                subject: "IRB Requests Modification for: TEST-1234",
                user: getUser(),
                issue: getIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendIrbModRequested(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

    void testSendRequestModificationForIRB() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                toAddresses: [service.getDefaultRecipient()],
                subject: "ORSP Requests Modification to: TEST-1234",
                comment: "Comment",
                user: getUser(),
                issue: getNonIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendRequestModification(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

    void testSendRequestModificationForNonIRB() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                view: "/notify/requestMod",
                toAddresses: [service.getDefaultRecipient()],
                ccAddresses: service.getOrspSpecialRecipients(),
                subject: "ORSP Requests Modification to: TEST-1234",
                comment: "Comment",
                user: getUser(),
                issue: getIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendRequestModification(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

    void testSendNotEngagedDetermination() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                toAddresses: [service.getDefaultRecipient()],
                subject: "Broad Determined to be Not Engaged: TEST-1234",
                comment: "Comment",
                user: getUser(),
                issue: getNonIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendNotEngagedDetermination(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

    void testSendNHSRDetermination() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                toAddresses: [service.getDefaultRecipient()],
                subject: "Broad Determined to be Not Human Subjects Research: TEST-1234",
                comment: "Comment",
                user: getUser(),
                issue: getNonIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendNHSRDetermination(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

    void testSendApplicationSubmitForIrb() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                toAddresses: [service.getDefaultRecipient()],
                fromAddress: getUser()?.emailAddress,
                ccAddresses: [getUser()?.emailAddress],
                subject: "Project Submission Received by ORSP: TEST-1234",
                comment: "Comment",
                user: getUser(),
                issue: getIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendApplicationSubmit(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

    void testSendApplicationSubmitForNonIrb() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                comment: "Comment",
                toAddresses: [service.getDefaultRecipient()],
                subject: "Project Submission Received by ORSP: TEST-1234",
                user: getUser(),
                issue: getNonIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendApplicationSubmit(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

    void testSendSupportingDocumentsSubmit() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                comment: "Comment",
                toAddresses: [service.getDefaultRecipient()],
                fromAddress: service.getDefaultRecipient(),
                ccAddresses: [getUser().getEmailAddress()],
                subject: "Project Submission Received by ORSP: TEST-1234",
                user: getUser(),
                issue: getIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendSupportingDocumentsSubmit(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

    void testSendComment() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                comment: "Comment",
                toAddresses: [service.getDefaultRecipient()],
                fromAddress: service.getDefaultRecipient(),
                subject: "Comment Entered: TEST-1234",
                user: getUser(),
                issue: getIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendComment(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

    void testSendClosed() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                toAddresses: [service.getDefaultRecipient()],
                fromAddress: service.getDefaultRecipient(),
                user: getUser(),
                issue: getIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendClosed(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

    void testSendWithdrawn() {
        setup:
        resetWireMock()
        NotifyArguments arguments = new NotifyArguments(
                toAddresses: [service.getDefaultRecipient()],
                fromAddress: service.getDefaultRecipient(),
                user: getUser(),
                issue: getIrbIssue())

        when:
        Map<Boolean, String> sendMailStatus = service.sendWithdrawn(arguments)

        then:
        sendMailStatus.containsKey(Boolean.TRUE)
    }

}
