import ch.qos.logback.classic.encoder.PatternLayoutEncoder
import grails.util.BuildSettings
import grails.util.Environment

// See http://logback.qos.ch/manual/groovy.html for details on configuration
appender('STDOUT', ConsoleAppender) {
    encoder(PatternLayoutEncoder) {
        pattern = "%level [%d{MM/dd/yyyy HH:mm:ss.SSS}] %logger{36} - %msg%n"
    }
}

// See http://grailsblog.objectcomputing.com/posts/2016/11/01/configure-rolling-log-files-with-logback.html
// and https://logback.qos.ch/manual/appenders.html#TimeBasedRollingPolicy
appender('FILE', RollingFileAppender) {
    file = "logs/orsp-${Environment.currentEnvironment.name}.log"
    append = true
    encoder(PatternLayoutEncoder) {
        pattern = "%level [%d{MM/dd/yyyy MM/dd/yyyy HH:mm:ss.SSS}] %logger{36} - %msg%n"
    }
    rollingPolicy(TimeBasedRollingPolicy) {
        fileNamePattern = "logs/orsp-${Environment.currentEnvironment.name}-%d{yyyy-MM-dd}.log"
    }
}

appender('NOTIFY', RollingFileAppender) {
    file = "logs/orsp-${Environment.currentEnvironment.name}-notify.log"
    append = true
    encoder(PatternLayoutEncoder) {
        pattern = "%level [%d{MM/dd/yyyy MM/dd/yyyy HH:mm:ss.SSS}] %logger{36} - %msg%n"
    }
    rollingPolicy(TimeBasedRollingPolicy) {
        fileNamePattern = "logs/orsp-${Environment.currentEnvironment.name}-notify-%d{yyyy-MM-dd}.log"
    }
}

def targetDir = BuildSettings.TARGET_DIR
if (Environment.isDevelopmentMode() && targetDir) {
    appender("FULL_STACKTRACE", FileAppender) {
        file = "${targetDir}/stacktrace.log"
        append = true
        encoder(PatternLayoutEncoder) {
            pattern = "%level [%d{MM/dd/yyyy HH:mm:ss.SSS}] %logger{36} - %msg%n"
        }
    }
    logger("StackTrace", ERROR, ['FULL_STACKTRACE'], false)
}

if (Environment.getCurrent() == Environment.TEST) {
    logger 'org.broadinstitute', DEBUG, ['STDOUT']
}

logger('org.broadinstitute.orsp.SearchController', DEBUG, ['FILE'])
logger('org.broadinstitute.orsp.QueryService', DEBUG, ['FILE'])

logger("org.apache.http.headers", INFO)
logger("org.apache.http.wire", INFO)
logger("org.broadinstitute.orsp.NotifyService", DEBUG, ["NOTIFY"], true)
logger("org.broadinstitute.orsp.sendgrid", DEBUG, ["NOTIFY"], true)

root(INFO, ['STDOUT', 'FILE'])
