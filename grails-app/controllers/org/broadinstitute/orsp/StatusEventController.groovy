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
//        Issue issue = queryService.findByKey(params.projectKey)
        // Sort ascending and create DTOs
        Collection<Event> eventDTOs = statusEventService.getProjectEvents(params.projectKey)

        render eventDTOs as JSON
    }

    def findQaEventReport() {
        UtilityClass.registerQaReportIssueMarshaller()
        Collection<String> issueTypeNames = (params?.tab == NO_IRB) ?
                EnumSet.of(IssueType.NE, IssueType.NHSR)*.getName() :
                EnumSet.of(IssueType.IRB)*.getName()
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
