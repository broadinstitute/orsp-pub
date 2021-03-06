package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.ConsentCollectionLink
import org.broadinstitute.orsp.ConsentExportService
import org.broadinstitute.orsp.ConsentService
import org.broadinstitute.orsp.DataUseRestriction
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.SampleCollection
import org.broadinstitute.orsp.consent.ConsentResource
import org.broadinstitute.orsp.utils.UtilityClass
import org.broadinstitute.orsp.webservice.PaginationParams

@Slf4j
@Resource
class DataUseController extends AuthenticatedController {

    ConsentService consentService
    ConsentExportService consentExportService

    def findDataUseRestrictions() {
        PaginationParams pagination = new PaginationParams(
                draw: params.getInt("draw") ?: 1,
                start: params.getInt("start") ?: 0,
                length: params.getInt("length") ?: 50,
                orderColumn: params.getInt("orderColumn") ?: 0,
                sortDirection: params.get("sortDirection")?.toString() ?: "asc",
                searchValue: params.get("searchValue")?.toString() ?: null)
        render queryService.findDataUseRestrictions(pagination) as JSON
    }

    def findRestriction() {
        UtilityClass.registerSampleCollectionMarshaller()
        DataUseRestriction restriction = DataUseRestriction.findById(params.id)
        List<String> summary = consentService.getSummary(restriction)
        Issue consent = queryService.findByKey(restriction.consentGroupKey)
        String consentGroupName = consent.summary
        ConsentResource consentResource = consentService.buildConsentResource(restriction, consentGroupName)
        Collection<ConsentCollectionLink> collectionLinks = queryService.findCollectionLinksByConsentKey(restriction.consentGroupKey)
        collectionLinks.retainAll { it.sampleCollectionId != null }
        Set<SampleCollection> samples = collectionLinks.collect{ it.sampleCollection }
        JSON.use(UtilityClass.SAMPLES) {
            render([restriction    : restriction,
                    restrictionUrl : restriction.getConsentUrl(getConsentServiceUrl()),
                    summary        : summary,
                    consent        : consent,
                    samples        : samples,
                    consentResource: consentResource.toString()] as JSON)

        }
    }

    def exportConsent() {
        try {
            DataUseRestriction restriction = DataUseRestriction.findById(params.id)
            Collection<String> sampleCollectionIds = queryService.findAllSampleCollectionIdsForConsent(restriction.getConsentGroupKey())
            Issue consent = queryService.findByKey(restriction.consentGroupKey)
            ConsentResource resource = consentExportService.exportConsent(
                    getUser(),
                    restriction,
                    sampleCollectionIds,
                    consent.summary)
            response.status = 200
            render([message: "Consent successfully exported to DUOS: $resource.name"] as JSON)
        }
        catch (Exception e) {
            handleException(e)
        }
    }

    private String getConsentServiceUrl() {
        grailsApplication.config.consent.service.url
    }

}
