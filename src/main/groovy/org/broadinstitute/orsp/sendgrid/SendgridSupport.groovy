package org.broadinstitute.orsp.sendgrid

import com.google.gson.GsonBuilder
import groovy.util.logging.Slf4j
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.HttpResponseException

import static groovyx.net.http.ContentType.URLENC

@Slf4j
trait SendgridSupport {

    /**
     * See https://sendgrid.com/docs/API_Reference/api_v3.html for example usage
     * See also https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/errors.html#message.recipient-errors
     *
     * Pre-validates incoming data to work with Sendgrid's API
     *
     * @param subject
     * @param toAddresses
     * @param ccAddresses
     * @param fromAddress
     * @param replyTos
     * @param messageContent
     * @param emailToDisplayNameMap
     * @return List of Mail Messages
     */
    Mail generateEmailMessage(String subject, List<String> toAddresses, List<String> ccAddresses, List<String> bccAddresses, String fromAddress, String replyTo, String messageContent, Map<String, String> emailToDisplayNameMap) {
        if (toAddresses.isEmpty()) {
            throw new IllegalArgumentException("To addresses cannot be empty")
        }
        if (fromAddress.isEmpty()) {
            throw new IllegalArgumentException("From address cannot be empty")
        }
        if (replyTo.isEmpty()) {
            throw new IllegalArgumentException("Reply-to address cannot be empty")
        }

        toAddresses.unique()
        // To, cc, and bcc addresses have to be unique within a personalization.
        ccAddresses?.removeAll(toAddresses)
        if (bccAddresses) ccAddresses?.removeAll(bccAddresses)
        bccAddresses?.removeAll(toAddresses)
        if (ccAddresses) bccAddresses?.removeAll(ccAddresses)

        Personalization personalization = new Personalization(
                to: toAddresses.collect { createEmailUser(it, emailToDisplayNameMap) },
                subject: subject
        )
        if (!ccAddresses?.isEmpty()) {
            def ccRecipients = createEmailUsers(ccAddresses, emailToDisplayNameMap)
            if (!ccRecipients.empty) personalization.setCc(ccRecipients)
        }
        if (!bccAddresses?.isEmpty()) {
            def bccRecipients = createEmailUsers(bccAddresses, emailToDisplayNameMap)
            if (!bccRecipients.empty) personalization.setBcc(bccRecipients)
        }
        EmailUser fromRecipient = createEmailUser(fromAddress, emailToDisplayNameMap)
        EmailUser replyToRecipient = createEmailUser(replyTo, emailToDisplayNameMap)
        Content content = new Content(type: "text/html", value: messageContent)
        new Mail(
                personalizations: Collections.singletonList(personalization),
                from: fromRecipient,
                reply_to: replyToRecipient,
                subject: subject,
                content: Collections.singletonList(content))
    }

    private List<EmailUser> createEmailUsers(Collection<String> emails, Map<String, String> emailToDisplayNameMap) {
        emails.findAll{ !it.empty }.
                unique().
                collect { createEmailUser(it, emailToDisplayNameMap) }.
                findAll { null != it }
    }

    private EmailUser createEmailUser(String email, Map<String, String> emailToDisplayNameMap) {
        email?.empty ? null : new EmailUser(email: email, name: emailToDisplayNameMap.getOrDefault(email, email))
    }

    /**
     * See https://github.com/jgritman/httpbuilder/wiki/POST-Examples for example usage
     *
     * Send a json formatted message to the SendGrid API server.
     *
     * @param message
     * @param apiKey
     * @param sendGridUrl
     * @return Response is a map entry with true/false and a reason for failure, if failed.
     */
    Map<Boolean, String> sendMail(Mail message, String apiKey, String sendGridUrl) {
        def http = new HTTPBuilder(sendGridUrl)
        http.setHeaders(['Authorization': 'Bearer ' + apiKey, 'Content-type': 'application/json'])
        def postBody = new GsonBuilder().create().toJson(message)
        log.debug(postBody)
        Map<Boolean, String> status = new HashMap<>()
        try {
            http.post(body: postBody, requestContentType: URLENC) { resp ->
                log.info("Response headers: ${resp.headers.join("; ")}")
            }
            status.put(true, "")
        } catch (HttpResponseException e) {
            log.error(e.getResponse().getStatusLine().getReasonPhrase())
            status.put(false, "HttpResponseException: " + e.getResponse().getStatusLine().getReasonPhrase())
            throw new HttpResponseException(e.getResponse())
        } catch (Exception e) {
            log.error(e.message)
            status.put(false, "Exception: " + e.message)
            throw  new Exception(e.message)
        }
        status
    }

}
