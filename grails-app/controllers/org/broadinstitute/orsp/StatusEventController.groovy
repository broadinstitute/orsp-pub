package org.broadinstitute.orsp

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.utils.UtilityClass
import org.joda.time.Period


@Slf4j
@Resource(readOnly = false, formats = ['JSON'])
class StatusEventController extends AuthenticatedController {
    final static String NO_IRB = "noIrb"
    final static String ALL_PROJECTS = 'all'

    def qaEventReport() {
        render(view: "/mainContainer/index")
    }

    // TODO: unused, this must be re-implemented
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
    // TODO: unused, this must be re-implemented
    def project() {
        Issue issue = queryService.findByKey(params.id)
        // Sort ascending and create DTOs
        List<StatusEventDTO> eventDTOs = statusEventService.getStatusEventDTOs(params.id)
        [statusEvents: eventDTOs, issue: issue]
    }

    def findQaEventReport() {
        UtilityClass.registerQaReportIssueMarshaller()
        Collection<String> issueTypeNames = new ArrayList<String>()

        if (params.tab) {
            issueTypeNames = params.tab == NO_IRB ? [IssueType.NE.name, IssueType.NHSR.name] : [IssueType.IRB.name]
        }
        try {
            JSON.use(UtilityClass.ISSUE_FOR_QA) {
                render queryService.findIssuesForStatusReport(issueTypeNames) as JSON
            }
        } catch(IllegalArgumentException e) {
            response.status = 400
            render([error: e.message] as JSON)
        }
    }
}
