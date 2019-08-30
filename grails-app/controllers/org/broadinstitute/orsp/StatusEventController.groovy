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
        DateFormat formatter = new SimpleDateFormat("MM/dd/yyyy")

        try {
            if (params.before)
                queryOptions.before = new Timestamp(formatter.parse(params.before).getTime())
            if (params.after) {
                queryOptions.after = new Timestamp(formatter.parse(params.after).getTime())
            }
        } catch (ParseException e) {
            log.error("Date Parse Exception: " + e)
        }

        if (params.projectType && params.projectType != ALL_PROJECTS) {
            queryOptions.issueTypeNames = [IssueType.valueOfController(params.projectType).name]
        } else if (params.tab) {
            queryOptions.issueTypeNames = params.tab == NO_IRB ? [IssueType.NE.name, IssueType.NHSR.name] : [IssueType.IRB.name]
        }

        PaginationParams pagination = new PaginationParams(
            draw: params.getInt("draw") ?: 1,
            start: params.getInt("start") ?: 0,
            length: params.getInt("length") ?: 20,
            orderColumn: params.getInt("orderColumn") ?: 0,
            sortDirection: params.get("sortDirection")?.toString() ?: "asc",
            searchValue: params.get("searchValue")?.toString() ?: null)

        JSON.use(UtilityClass.ISSUE_FOR_QA) {
            render queryService.findIssuesForStatusReport(pagination, queryOptions) as JSON
        }
    }

}
