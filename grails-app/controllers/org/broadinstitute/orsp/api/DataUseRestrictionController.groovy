package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.core.GrailsApplication
import grails.rest.Resource
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.ConsentCollectionLink
import org.broadinstitute.orsp.ConsentExportService
import org.broadinstitute.orsp.ConsentService
import org.broadinstitute.orsp.DataUseLetterService
import org.broadinstitute.orsp.DataUseRestriction
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.SampleCollection
import org.broadinstitute.orsp.consent.ConsentResource
import org.broadinstitute.orsp.utils.UtilityClass


@Resource(readOnly = false, formats = ['JSON'])
class DataUseRestrictionController extends AuthenticatedController {

    ConsentService consentService
    GrailsApplication grailsApplication

    def show() {
        render(view: "/mainContainer/index", model:[restrictionId: params.id])
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
                    summary        : summary,
                    consent        : consent,
                    collectionLinks: samples,
                    consentResource: consentResource.toString()] as JSON)

        }
    }
}
