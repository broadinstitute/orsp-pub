package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.config.NotifyConfiguration
import org.hibernate.SQLQuery
import org.hibernate.SessionFactory

import javax.mail.Multipart
import javax.mail.internet.MimeBodyPart
import javax.mail.internet.MimeMultipart
import java.text.SimpleDateFormat
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

@Slf4j
@Transactional(readOnly = true)
class SchedulerService {

    NotifyConfiguration notifyConfiguration
    def grailsApplication

    String getDefaultFromAddress() {
        notifyConfiguration.fromAddress
    }

    String getEmailConfig(String name) {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = 'SELECT email_config_value from email_config where email_config_name =\'' + name + '\';'
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
        def formatDate = new SimpleDateFormat("MM-dd-yyyy").format(new Date())
        String filename = 'ORSP_Pending_Report-' + formatDate + '.csv'
        log.info(filename)
        convertToCSVAndWriteToFile(csvData, filename)
    }

    def convertToCSVAndWriteToFile(data, filename) {
        def csv = new File(filename)
        csv.withWriter { writer ->
            data.each { row ->
                row.eachWithIndex { cell, index ->
                    writer.write("\"${cell}\"")
                    if (index < row.size() - 1) {
                        writer.write(',')
                    }
                }
                writer.write('\n')
            }
        }
        sendEmail(filename)
    }

    def sendEmail(String filename) {
        Properties prop = new Properties();
        prop.put("mail.smtp.host", getEmailConfig('host'));
        prop.put("mail.smtp.port", getEmailConfig('port'));

        Session session = Session.getInstance(prop, null);
//        session.setDebug(true)                                                         // uncomment to get detailed info

        def formatDate = new SimpleDateFormat("MM/dd/yyyy").format(new Date())

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(getDefaultFromAddress()));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(getEmailConfig('to'))
            );
            // CC recipients
            //List<InternetAddress> ccList = InternetAddress.parse("saakhil@broadinstitute.org, amaljith@broadinstitute.org")
            //message.setRecipients(Message.RecipientType.CC, ccList)
            message.setSubject(getEmailConfig('subject') + " - " + formatDate);

            //message
            MimeBodyPart messageBody = new MimeBodyPart()
            messageBody.setContent("<p>Hi team, <br>Attached herewith is the report of Pending ORSP projects as of " + formatDate + "." +
                    "<p>Thanks,<br>ORSP</p>" +
                    "<i>This is an automated mail. Please don't reply.</i></p>",
                    "text/html; charset=utf-8"
            )
            Multipart multipart = new MimeMultipart()
            multipart.addBodyPart(messageBody)

            //attachment
            MimeBodyPart messageBodyAttach = new MimeBodyPart()
            messageBodyAttach.attachFile(filename)
            multipart.addBodyPart(messageBodyAttach)

            //set message
            message.setContent(multipart)

            Transport.send(message);
            log.info(message.getSubject() + " sent successfully");
            // Delete the file after sending the email
            File file = new File(filename)
            if (file.delete()) log.info(filename + ' file deleted')

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

}
