package org.broadinstitute.orsp

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.utils.UtilityClass
import org.broadinstitute.orsp.webservice.PaginationParams
import org.joda.time.Period

import java.sql.Timestamp
import java.text.DateFormat
import java.text.ParseException
import java.text.SimpleDateFormat

@Slf4j
@Resource(readOnly = false, formats = ['JSON'])
class StatusEventController extends AuthenticatedController {
    final static String NO_IRB = "noIrb"
    final static String ALL_PROJECTS = 'all'

    def qaEventReport() {
        render(view: "/mainContainer/index")
    }

    private Map<String, Period> calculateIssuePeriods(Collection<Issue> issues) {
        issues.collectEntries { issue ->
            List<StatusEventDTO> eventDTOs = statusEventService.getStatusEventDTOs(issue.projectKey)
            Period period = null
            if (!eventDTOs?.isEmpty()) {
                period = eventDTOs.last().duration
            } else {
                log.warn("There are no period events for issue ${issue.projectKey}")
            }
            [issue.projectKey, period]
        }
    }

    def project() {
        Issue issue = queryService.findByKey(params.id)
        // Sort ascending and create DTOs
        List<StatusEventDTO> eventDTOs = statusEventService.getStatusEventDTOs(params.id)
        [statusEvents: eventDTOs, issue: issue]
    }

    def findQaEventReport() {
        UtilityClass.registerQaReportIssueMarshaller()
        QueryOptions queryOptions = new QueryOptions()
        if (params.projectType && params.projectType != ALL_PROJECTS) {
            queryOptions.issueTypeNames = [IssueType.valueOfController(params.projectType).name]
        } else if (params.tab) {
            queryOptions.issueTypeNames = params.tab == NO_IRB ? [IssueType.NE.name, IssueType.NHSR.name] : [IssueType.IRB.name]
        }
        JSON.use(UtilityClass.ISSUE_FOR_QA) {
            render queryService.findIssuesForStatusReport(queryOptions) as JSON
        }
    }

}
