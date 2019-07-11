package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AAHRPPMetrics
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.ReportService
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

        PaginationParams pagination = new PaginationParams(
                draw: params.getInt("draw") ?: 1,
                start: params.getInt("start")?: 0,
                length: params.getInt("length")?: 10,
                orderColumn: params.getInt("orderColumn")? params.get("orderColumn"): 0,
                sortDirection: params.get("sortDirection")? params.get("sortDirection").toString() : "asc",
                searchValue: params.get("searchValue")? params.get("searchValue").toString() : null)
        render(queryService.queryFundingReport(pagination) as JSON)

//        PaginationParams pagination = new PaginationParams(
//                draw: params.getInt("draw")?: 1,
//                start: params.getInt("start")?: 0,
//                length: params.getInt("length")?: 10,
//                orderColumn: params.getInt("order[0][column]")?: 0,
//                sortDirection: params.get("order[0][dir]")? params.get("order[0][dir]").toString() : "asc",
//                searchValue: params.get("search[value]")? params.get("search[value]").toString() : null)
//        render(queryService.queryFundingReport(pagination) as JSON)
    }

    def aahrppMetrics() {
        Collection<AAHRPPMetrics> metrics = queryService.findAllAAHRPPMetrics()
        String content = reportService.createReport(metrics.toList())
        response.setHeader("Content-disposition", "attachment; filename=AAHRPPMetrics.csv")
        response.outputStream << content
    }

}
