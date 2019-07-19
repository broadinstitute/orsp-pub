package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AAHRPPMetrics
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.Funding
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.ReportService
import org.broadinstitute.orsp.User
import org.broadinstitute.orsp.webservice.PaginationParams

@Slf4j
@Resource(readOnly = false, formats = ['JSON'])
class ReportController extends AuthenticatedController {

    ReportService reportService

    def index() {
        response.status = 501
        render([error: "Not Implemented"] as JSON)
    }

    def getFunding() {
        Long i = 0
        JSON.registerObjectMarshaller(Funding) {
            def output = [:]
            output['id'] = i++
            output['type'] = it.issue.type
            output['projectKey'] = it.issue.projectKey
            output['protocol'] = it.issue.protocol
            output['summary'] = it.issue.summary
            output['status'] = it.issue.status
            output['source'] = it.source
            output['name'] = it.name
            output['awardNumber'] = it.awardNumber
            output['pis'] = getPIsDisplayName((Issue) it.issue)//it.issue.getPIs().collect{r -> getUser(r).displayName}
            return output
        }

        PaginationParams pagination = new PaginationParams(
                draw: params.getInt("draw") ?: 1,
                start: params.getInt("start")?: 0,
                length: params.getInt("length")?: 10,
                orderColumn: params.getInt("orderColumn")? params.getInt("orderColumn"): 1,
                sortDirection: params.get("sortDirection")? params.get("sortDirection").toString() : "desc",
                searchValue: params.get("searchValue")? params.get("searchValue").toString() : null)
        render(queryService.queryFundingReport(pagination) as JSON)
    }

    def getAllFundings() {
        Collection<Funding> fundings = queryService.getAllFundings()
        render(fundings as JSON)
    }

    def aahrppMetrics() {
        Collection<AAHRPPMetrics> metrics = queryService.findAllAAHRPPMetrics()
        String content = reportService.createReport(metrics.toList())
        response.setHeader("Content-disposition", "attachment; filename=AAHRPPMetrics.csv")
        response.outputStream << content
    }
List<String> getPIsDisplayName(Issue issue) {
    List<String> piUserNames = issue*.getPIs().flatten().unique()
    List<String> piDisplayNames = new ArrayList<String>()
    if (!piUserNames.isEmpty()) {
        piDisplayNames = User.findAllByUserNameInList(piUserNames).collect { it.displayName } // replace to mysql query
    }
    piDisplayNames
    }
}
