package org.broadinstitute.orsp

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.utils.UtilityClass

@Slf4j
@Resource(readOnly = false, formats = ['JSON'])
class StatusEventController extends AuthenticatedController {
    final static String NO_IRB = "noIrb"

    def findProjectReport() {
        try {
            List<StatusEventDTO> eventDTOs = statusEventService.getStatusEventsForProject(params.projectKey)
            render eventDTOs as JSON
        } catch(IllegalArgumentException e) {
            handleIllegalArgumentException(e)
        } catch(Exception e) {
            handleException(e)
        }
    }

    def findQaEventReport() {
        UtilityClass.registerQaReportIssueMarshaller()
        Collection<String> issueTypeNames = (params?.tab == NO_IRB) ?
                EnumSet.of(IssueType.NE, IssueType.NHSR, IssueType.EX)*.getName() :
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
