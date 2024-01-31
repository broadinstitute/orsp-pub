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
    UserService userService
    def grailsApplication

    String getDefaultFromAddress() {
        notifyConfiguration.fromAddress
    }

    String getAdminRecipient() {
        notifyConfiguration.adminRecipient
    }

    String getSendGridUrl() {
        notifyConfiguration.sendGridUrl
    }

    String getApiKey() {
        notifyConfiguration.apiKey
    }

    String getConfig(String name) {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = 'SELECT value from config where name =\'' + name + '\';'
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final result = sqlQuery.uniqueResult()
        result
    }

    void saveNotificationLog(
            String type,
            List<String> emailList,
            String from,
            String subject,
            String htmlContent,
            String filename = '',
            Integer statusCode,
            String error
    ) {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = new StringBuilder()
                                .append('INSERT INTO notification_log (`notification_type`, `from`, `to`, `subject`, `htmlcontent`, `attachment_name`, `status_code`, `error_data`) ')
                                .append('VALUES (:type, :from, :to, :subject, :htmlcontent, :filename, :statusCode, :error)')
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        sqlQuery.setParameter('type', type)
        sqlQuery.setParameter('from', from)
        sqlQuery.setParameter('to', emailList.toString())
        sqlQuery.setParameter('subject', subject)
        sqlQuery.setParameter('htmlcontent', htmlContent)
        sqlQuery.setParameter('filename', filename)
        sqlQuery.setParameter('statusCode', statusCode)
        sqlQuery.setParameter('error', error)
        sqlQuery.executeUpdate()
    }

    def generateMailBody(
            List<String> emailList,
            String subject,
            String htmlContent,
            String base64Content,
            String filename,
            String filetype
    ) {
        def mail = [
                personalizations: [
                        [
                                to: emailList.collect {email ->
                                    [email: email]
                                }
                        ]
                ],
                from: [
                        email: getDefaultFromAddress()
                ],
                subject: subject,
                content: [
                        [
                                type: 'text/html',
                                value: htmlContent
                        ]
                ]
        ]

        if (base64Content) {
            mail.put("attachments", [
                    [
                            content: base64Content,
                            filename: filename,
                            type: filetype,
                            disposition: 'attachment'
                    ]
            ])
        }

        return mail
    }

    def sendMail(
            String type,
            List<String> emailList,
            String subject,
            String htmlContent,
            String base64Content = '',
            String filename = '',
            String filetype = ''
    ) {
        List<String> emails = emailList
        String subj = subject
        String sendgridUrl = getSendGridUrl()
        String apiKey = getApiKey()
        def client = new RESTClient(sendgridUrl)
        client.headers['Authorization'] = 'Bearer ' + apiKey

        if (Environment.getCurrent() != Environment.PRODUCTION) {
            emails = getConfig('devRecipients').split(',').collect { it.trim() }
            subj = "[TEST] " + subject
            log.info("Originally sending notification to: " + emailList as String)
            log.info("Now sending notification to: " + getConfig('devRecipients'))
        }

        def mail = generateMailBody(emails, subj, htmlContent, base64Content, filename, filetype)
        log.info('Mail data: ' + mail)

        def response = client.post(
                'contentType': 'application/json',
                'body': mail
        )
        saveNotificationLog(type, emailList, getDefaultFromAddress(), subject, htmlContent, filename, response.status, response.data as String)
        if (response.status >= 200 || response.status < 300) {
            log.info(response.status as String)
            log.info('Email sent succesfully')
        } else {
            log.info(response.status as String)
            log.info(response.data as String)
        }
        return response.status
    }

    def getWeeklyReportData() {
        List csvData = [['Project Key', 'Title', 'Assigned Reviewer', 'Submission Date', 'Status']]
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = new StringBuilder()
                                .append('SELECT t1.project_key, CONCAT(\'"\', REPLACE(t1.summary, \'"\', \'\\\'\'), \'"\') as title, ')
                                .append('COALESCE(JSON_UNQUOTE(JSON_EXTRACT(t2.value, \'$.value\')), "Not Assigned") as assigned_reviewer, ')
                                .append('DATE_FORMAT(t1.request_date, \'%m-%d-%Y\'), t1.approval_status FROM issue t1 ')
                                .append('LEFT JOIN issue_extra_property t2 ON ')
                                .append('t2.project_key = t1.project_key AND t2.name=\'assignedAdmin\' ')
                                .append('WHERE (t1.approval_status=\'Pending ORSP Admin Review\' ')
                                .append('OR t1.approval_status=\'On Hold\') AND t1.deleted=0 ORDER BY t1.request_date;')
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final result = sqlQuery.with {it ->
            list()
        }
        csvData.addAll(result)
        sendWeeklyReport(csvData)
    }

    def convertListToCSV(List<List<String>> dataList) {
        def csvString = dataList.collect { row ->
            row.join(',')
        }.join('\n')

        return csvString
    }

    def sendWeeklyReport(List csvData) {
        String formatDate = new SimpleDateFormat("MM.dd.yyyy").format(new Date())
        String filename = 'ORSP_Pending_Report-' + formatDate + '.csv'

        def csvContent = convertListToCSV(csvData)
        def attachmentBytes = csvContent.getBytes('UTF-8')
        def base64EncodedCSV = Base64.getEncoder().encodeToString(attachmentBytes)

        String from = getDefaultFromAddress()
        List<String> emailList = getConfig('weeklyReportRecipients').split(',').collect { it.trim() }
        String subject = 'Weekly Report of ORSP Pending Projects - ' + formatDate
        String htmlContent = "<p>Hi team, <br>Attached herewith is the report of Pending ORSP projects as of " + formatDate + "." +
                "<p>Thanks,<br>ORSP</p>" +
                "<i>This is an automated mail. Please don't reply.</i></p>"

        sendMail('Weekly report', emailList, subject, htmlContent, base64EncodedCSV, filename, 'text/csv')
    }

    def getAnnualRenewalProject() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd")
        Calendar calendar = Calendar.getInstance()
        Integer anniversaryInterval = getConfig('anniversaryInterval').toInteger()
        calendar.setTime(new Date())
        calendar.add(Calendar.DATE, anniversaryInterval)
        Date newDate = calendar.getTime()
        String dateString = sdf.format(newDate)
        dateString = dateString.replace('-', '/').substring(5)

        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = new StringBuilder()
            .append('SELECT t1.project_key, t2.type, t2.summary, ')
            .append('COALESCE(MAX(CASE WHEN t1.name=\'projectStatusDate\' THEN t1.value END), ')
            .append('MAX(CASE WHEN t1.name=\'initialDate\' THEN t1.value END)) as project_approval_date, ')
            .append('CONCAT(\'"\', GROUP_CONCAT(CASE WHEN t1.name=\'pm\' THEN t1.value END), \'"\') as pm ')
            .append('FROM issue_extra_property t1 ')
            .append('LEFT JOIN issue t2 ON t1.project_key = t2.project_key and t2.approval_status=\'Approved\' ')
            .append('WHERE (t1.name=\'projectStatusDate\' AND t1.value like "%":date) OR ')
            .append('(t1.name=\'initialDate\' AND t1.value like "%":date) OR t1.name=\'pm\' ')
            .append('GROUP BY t1.project_key, t2.type, t2.summary ')
            .append('HAVING COALESCE(MAX(CASE WHEN t1.name=\'projectStatusDate\' THEN t1.value END), MAX(CASE WHEN t1.name=\'initialDate\' THEN t1.value END))')
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        sqlQuery.setParameter('date', dateString)
        final result = sqlQuery.with {it ->
            list()
        }

        // send email to project managers
        result.each {it ->
            List pmEmail = []
            Collection<String> projectManagers = it.last() != null ? it.last().replaceAll('"', '').split(',') : null
            def pmEmailCollection = projectManagers != null ? userService.findUsers(projectManagers) : null
            pmEmailCollection.each {pm -> pmEmail.add(pm.emailAddress)}
            String subject = 'ORSP project '+ it[0] +' annual renewal reminder'
            String htmlContent = "<p>Dear Project Managers, <br>" +
                    "<br>The project "+ it[0] +" is approaching its annual renewal date on " + sdf.format(newDate) + ".</p>" +
                    "<p>Kindly take a moment to review and update project details as needed. If the project is complete, please confirm closure with the ORSP.<br>" +
                    "Your attention to this matter is appreciated.</p>" +
                    "<p>Thanks,<br>ORSP</p>" +
                    "<i>This is an automated mail. Please don't reply.</i></p>"

            sendMail('Annual renewal reminder', pmEmail, subject, htmlContent)
        }

        // send email to ORSP with the list of annual projects
        List orspCSVData = [['Project Key', 'Type', 'Title', 'Approval Date', 'Project Manager']]
        orspCSVData.addAll(result)
        String filename = 'ORSP_Annual_Renewal_Report-' + sdf.format(newDate) + '.csv'
        def csvContent = convertListToCSV(orspCSVData)
        def attachmentBytes = csvContent.getBytes('UTF-8')
        def base64EncodedCSV = Base64.getEncoder().encodeToString(attachmentBytes)
        String subject = 'ORSP anniversary project notification (' + sdf.format(newDate) + ')'
        String htmlContent = '<p>Hi ORSP, <br>' +
                '<br>FYA<br>' +
                'Attached herewith is the list of projects that are approaching its annual renewal date on ' + sdf.format(newDate) + '.' +
                '<br>Kindly review and and update project details as needed.</p>' +
                '<br>"<i>This is an automated mail. Please don\'t reply.</i>"'
        sendMail('ORSP anniversary project notification', [getAdminRecipient()], subject, htmlContent, base64EncodedCSV, filename, 'text/csv')
    }
}
