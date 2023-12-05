package org.broadinstitute.orsp

import grails.util.Environment
import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j
import groovyx.net.http.RESTClient
import org.broadinstitute.orsp.config.NotifyConfiguration
import org.hibernate.SQLQuery
import org.hibernate.SessionFactory

import java.text.SimpleDateFormat

@Slf4j
@Transactional(readOnly = true)
class SchedulerService {

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

    String getEmailConfig(String name) {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = 'SELECT value from email_config where name =\'' + name + '\';'
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final result = sqlQuery.uniqueResult()
        result
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
        sendMail(csvData)
    }

    def convertListToCSV(List<List<String>> dataList) {
        def csvString = dataList.collect { row ->
            println(row)
            row.join(';')
        }.join('\n')

        return csvString
    }

    def sendMail(List csvData) {
        String formatDate = new SimpleDateFormat("MM.dd.yyyy").format(new Date())
        String filename = 'ORSP_Pending_Report-' + formatDate + '.csv'
        String sendgridUrl = getSendGridUrl()
        String apiKey = getApiKey()

        def csvContent = convertListToCSV(csvData)
        def attachmentBytes = csvContent.getBytes('UTF-8')
        def base64EncodedCSV = Base64.getEncoder().encodeToString(attachmentBytes)

        String from = getDefaultFromAddress()
        List<String> emailList = getEmailConfig('to').split(',').collect { it.trim() }
        String subject = (Environment.getCurrent() == Environment.PRODUCTION) ?
                'Weekly Report of ORSP Pending Projects - ' + formatDate :
                '[Test] - Weekly Report of ORSP Pending Projects - ' + formatDate
        String htmlContent = "<p>Hi team, <br>Attached herewith is the report of Pending ORSP projects as of " + formatDate + "." +
                "<p>Thanks,<br>ORSP</p>" +
                "<i>This is an automated mail. Please don't reply.</i></p>"
        def client = new RESTClient(sendgridUrl)
        client.headers['Authorization'] = 'Bearer ' + apiKey

        def mail = [
                personalizations: [
                    [
                        to: emailList.collect {email ->
                            [email: email]
                        }
                    ]
                ],
                from: [
                    email: from
                ],
                subject: subject,
                content: [
                    [
                        type: 'text/html',
                        value: htmlContent
                    ]
                ],
                attachments: [
                    [
                        content: base64EncodedCSV,
                        filename: filename,
                        type: 'text/csv',
                        disposition: 'attachment'
                    ]
                ]
        ]
        log.info('Mail data: ' + mail)

        def response = client.post(
                'contentType': 'application/json',
                'body': mail
        )

        if (response.status >= 200 || response.status < 300) {
            log.info(response.status as String)
            log.info('Email sent succesfully success')
        } else {
            log.info(response.status as String)
            log.info(response.data as String)
        }
    }
}
