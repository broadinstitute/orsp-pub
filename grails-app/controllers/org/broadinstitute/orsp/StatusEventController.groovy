package org.broadinstitute.orsp

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.utils.UtilityClass
import org.broadinstitute.orsp.webservice.PaginationParams
import org.joda.time.Period

import java.text.DateFormat
import java.text.ParseException

@Slf4j
@Resource(readOnly = false, formats = ['JSON'])
class StatusEventController extends AuthenticatedController {


    def qaEventReport() {
        render(view: "/mainContainer/index")
    }

    private Map<IssueType, Collection<Issue>> getGroupedIssues(QueryOptions options) {
        queryService.
                findIssuesForStatusReport(options).
                groupBy { IssueType.valueOfName(it.type) }
    }

    private Map<String, Period> calculateIssuePeriods(Collection<Issue> issues) {
        issues.collectEntries { issue ->
            List<StatusEventService.StatusEventDTO> eventDTOs = statusEventService.getStatusEventDTOs(issue.projectKey)
            Period period = null
            if (!eventDTOs?.isEmpty()) {
                period = eventDTOs.last().duration
            } else {
                log.warn("There are no period events for issue ${issue.projectKey}")
            }
            [issue.projectKey, period]
        }
    }

    def index() {
        QueryOptions options = new QueryOptions()
        DateFormat format = DateFormat.getDateInstance(DateFormat.SHORT)
        if (params.after) {
            try {
                options.after = format.parse(params.after)
            } catch (ParseException e) {
                log.error("Parse Exception: " + e)
                log.error("Unable to parse 'after' date: " + params.after)
                flash.error = e.getMessage()
            }
        }
        if (params.before) {
            try {
                options.before = format.parse(params.before)
            } catch (ParseException e) {
                log.error("Parse Exception: " + e)
                log.error("Unable to parse 'before' date: " + params.before)
                flash.error = e.getMessage()
            }
        }
        if (params.project_type) {
            options.issueTypeNames = [IssueType.valueOfController(params.project_type).name]
        }
        Map<IssueType, Collection<Issue>> groupedIssues = getGroupedIssues(options)
        Collection<Issue> irbs = groupedIssues.getOrDefault(IssueType.IRB, Collections.emptyList())
        Collection<Issue> nonIrbs = groupedIssues.getOrDefault(IssueType.NE, Collections.emptyList()) +
                groupedIssues.getOrDefault(IssueType.NHSR, Collections.emptyList())
        Map<String, Period> periodMap = calculateIssuePeriods(irbs + nonIrbs)
        [irbs: irbs, nonIrbs: nonIrbs, periodMap: periodMap]
    }

    def project() {
        Issue issue = queryService.findByKey(params.id)
        // Sort ascending and create DTOs
        List<StatusEventService.StatusEventDTO> eventDTOs = statusEventService.getStatusEventDTOs(params.id)
        [statusEvents: eventDTOs, issue: issue]
    }

    def findQaEventReport() {
        PaginationParams pagination = new PaginationParams(
            draw: params.getInt("draw") ?: 1,
            start: params.getInt("start") ?: 0,
            length: params.getInt("length") ?: 20,
            orderColumn: params.getInt("orderColumn") ?: 0,
            sortDirection: params.get("sortDirection")?.toString() ?: "asc",
            searchValue: params.get("searchValue")?.toString() ?: null)
        render queryService.findIssuesForStatusReport2(pagination, params.get("type").toString()) as JSON
    }

}
