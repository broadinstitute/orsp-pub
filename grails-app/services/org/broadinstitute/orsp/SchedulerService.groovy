package org.broadinstitute.orsp

import grails.util.Environment
import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.config.NotifyConfiguration
import org.broadinstitute.orsp.sendgrid.Attachment
import org.broadinstitute.orsp.sendgrid.Content
import org.broadinstitute.orsp.sendgrid.EmailUser
import org.broadinstitute.orsp.sendgrid.Mail
import org.broadinstitute.orsp.sendgrid.Personalization
import org.broadinstitute.orsp.sendgrid.SendgridSupport
import org.hibernate.SQLQuery
import org.hibernate.SessionFactory

import java.text.SimpleDateFormat

@Slf4j
@Transactional(readOnly = true)
class SchedulerService implements SendgridSupport{

    NotifyConfiguration notifyConfiguration
    def grailsApplication

    String getDefaultFromAddress() {
        notifyConfiguration.fromAddress
    }

    String getSendGridUrl() {
        notifyConfiguration.sendGridUrl
    }

    String getApiKey() {
        notifyConfiguration.apiKey
    }

    List getToEmail() {
        notifyConfiguration.weeklyPendingReportRecipients
    }

    def getWeeklyReportData() {
        List csvData = [['Project Key', 'Title', 'Assigned Reviewer', 'Submission Date', 'Status']]
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = new StringBuilder()
                                .append('SELECT t1.project_key, t1.summary as title, COALESCE(JSON_UNQUOTE(JSON_EXTRACT(t2.value, \'$.value\')), "Not Assigned") as assigned_reviewer, ')
                                .append('DATE_FORMAT(t1.request_date, \'%m-%d-%Y\'), t1.approval_status FROM orsp_dev.issue t1 ')
                                .append('LEFT JOIN orsp_dev.issue_extra_property t2 ON ')
                                .append('t2.project_key = t1.project_key AND t2.name=\'assignedAdmin\'')
                                .append('WHERE t1.approval_status=\'Pending ORSP Admin Review\' AND t1.deleted=0 ORDER BY t1.request_date;').toString()
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final result = sqlQuery.with {it ->
            list()
        }
        csvData.addAll(result)
        def formatDate = new SimpleDateFormat("MM-dd-yyyy").format(new Date())
        String filename = 'ORSP_Pending_Report-' + formatDate + '.csv'
        log.info(filename)
        sendEmail(csvData, filename)
    }

    def convertListToCSV(List<List<String>> dataList) {
        def csvString = dataList.collect { row ->
            row.join(',')
        }.join('\n')

        return csvString
    }

    def sendEmail(List csvData, String filename) {
        def formatDate = new SimpleDateFormat("MM-dd-yyyy").format(new Date())
        def csvContent = convertListToCSV(csvData)
        def attachmentBytes = csvContent.getBytes('UTF-8')
        def base64EncodedCSV = Base64.getEncoder().encodeToString(attachmentBytes)
        def fromEmail = new EmailUser(email: getDefaultFromAddress(), name: 'ORSP')
        String htmlContent = "<p>Hi team, <br>Attached herewith is the report of Pending ORSP projects as of " + formatDate + "." +
                "<p>Thanks,<br>ORSP</p>" +
                "<i>This is an automated mail. Please don't reply.</i></p>"
        String subject = (Environment.getCurrent() == Environment.PRODUCTION) ?
                'Weekly Report - Pending Projects ' + new SimpleDateFormat("MM/dd/yyyy").format(new Date()) :
                '[Test] - Weekly Report - Pending Projects ' + new SimpleDateFormat("MM/dd/yyyy").format(new Date())
        def content = new Content(type: 'text/html', value: htmlContent)
        def attachment = new Attachment(content: base64EncodedCSV, type: 'text/csv', filename: filename, disposition: 'attachment')
        def personalisedData = new Personalization(
                to: [],
                subject: subject
        )
        getToEmail().collect {it ->
            personalisedData.to.add(new EmailUser(email: it, name: it))
        }
        def mail = new Mail(
                personalizations: [],
                from: fromEmail,
                reply_to: fromEmail,
                subject: subject,
                content: [],
                attachment: []
        )
        mail.personalizations.add(personalisedData)
        mail.content.add(content)
        mail.attachment.add(attachment)
        log.debug(mail)
        sendMail(mail, getApiKey(), getSendGridUrl())
    }
}
