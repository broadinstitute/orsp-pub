package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AAHRPPMetrics
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.ConsentCollectionLink
import org.broadinstitute.orsp.DataUseRestriction
import org.broadinstitute.orsp.Funding
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueType
import org.broadinstitute.orsp.ReportService
import org.broadinstitute.orsp.utils.UtilityClass
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
        new UtilityClass(queryService).registerFundingsReportMarshaller()
        PaginationParams pagination = new PaginationParams(
                draw: params.getInt("draw") ?: 1,
                start: params.getInt("start") ?: 0,
                length: params.getInt("length") ?: 10,
                orderColumn: params.getInt("orderColumn") ?: 1,
                sortDirection: params.get("sortDirection")?.toString() ?: "desc",
                searchValue: params.get("searchValue")?.toString() ?: null)
        JSON.use(UtilityClass.FUNDING_REPORT_RENDERER_CONFIG) {
            render queryService.queryFundingReport(pagination) as JSON
        }
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

    def reviewCategories() {
        render(view: "/mainContainer/index")
    }

    def findReviewCategories() {
        UtilityClass.registerIssueMarshaller();
        PaginationParams pagination = new PaginationParams(
                draw: params.getInt("draw") ?: 1,
                start: params.getInt("start") ?: 0,
                length: params.getInt("length") ?: 50,
                orderColumn: params.getInt("orderColumn") ?: 0,
                sortDirection: params.get("sortDirection")?.toString() ?: "asc",
                searchValue: params.get("searchValue")?.toString() ?: null)
        JSON.use(UtilityClass.ISSUE_RENDERER_CONFIG) {
            render queryService.findIssueByProjectType(IssueType.IRB.name, pagination) as JSON
        }
    }


    def findCollectionLinks() {
        UtilityClass.registerConsentCollectionReportMarshaller()
        List<ConsentCollectionLink> links = queryService.findCollectionLinks()
        def result = []
        Collection<DataUseRestriction> durs = queryService.findDataUseRestrictionByConsentGroupKeyInList(links.collect {it.consentKey})
        links.groupBy { it.consentKey }.each { key, scLinks ->
            DataUseRestriction restriction = durs.find { it?.consentGroupKey == key }
            result.add([consentGroupKey: key,
                        collections    : scLinks,
                        restriction    : restriction
            ])
        }
        JSON.use(UtilityClass.CONSENT_COLLECTION) {
            render result as JSON
        }
    }

}
