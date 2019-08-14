package org.broadinstitute.orsp

import grails.core.GrailsApplication
import org.broadinstitute.orsp.consent.ConsentResource
import org.broadinstitute.orsp.utils.DataUseRestrictionParser


/**
 * Extend Base Controller with actions specific to Data Use Restrictions.
 */
class DataUseController extends AuthenticatedController {

    ConsentService consentService
    ConsentExportService consentExportService
    GrailsApplication grailsApplication
    DataUseLetterService dataUseLetterService

    @Override
    show() {
        DataUseRestriction restriction = DataUseRestriction.findById(params.id)
        List<String> summary = consentService.getSummary(restriction)
        Issue consent = queryService.findByKey(restriction.consentGroupKey)
        String consentGroupName = consent.summary
        ConsentResource consentResource1 = consentService.buildConsentResource(restriction, consentGroupName)
        String consentResource = consentResource1
        Collection<ConsentCollectionLink> collectionLinks = queryService.findCollectionLinksByConsentKey(restriction.consentGroupKey)
        collectionLinks.retainAll { it.sampleCollectionId != null }
        [restriction    : restriction,
         restrictionUrl : restriction.getConsentUrl(getConsentServiceUrl()),
         summary        : summary,
         consentResource: consentResource,
         consent        : consent,
         collectionLinks: collectionLinks]
    }

    // TODO: Move db logic to service
    @Override
    create() {
        Issue consent = queryService.findByKey(params.id)
        DataUseRestriction restriction = new DataUseRestriction()
        restriction.consentGroupKey = params.id
        restriction.consentPIName = params.principalInvestigatorName
        render(view: "edit", model: [consent: consent,
                                     restriction: restriction,
                                     create: params.create])
    }

    // TODO: Move db logic to service
    def edit() {
        DataUseRestriction restriction = DataUseRestriction.findById(params.id)
        Issue consent = queryService.findByKey(restriction.consentGroupKey)
        [restriction: restriction,
         consent    : consent,
         create     : params.create]
    }

    def save() {
        DataUseRestriction restriction = DataUseRestriction.findByConsentGroupKey(params.consentGroupKey)
        restriction = DataUseRestrictionParser.fromParams(restriction, params)
        restriction = dataUseLetterService.createSdul(restriction, getUser()?.displayName)
        if (params.create) {
            redirect(controller: 'newConsentGroup', action: "main", params: [consentKey: restriction.consentGroupKey, tab: 'documents'])
        } else {
            redirect(controller: 'dataUse', action: "show", params: [id: restriction.id])
        }
    }

    def list() {
        def links = queryService.findAllCollectionLinks()
        [restrictions      : DataUseRestriction.findAll(),
         consentCollections: links,
         consentMap        : links.groupBy { it.consentKey }]
    }

    def exportConsent() {
        DataUseRestriction restriction = DataUseRestriction.findById(params.id)
        Collection<String> sampleCollectionIds = queryService.findAllSampleCollectionIdsForConsent(restriction.getConsentGroupKey())
        StorageDocument dataUseLetter = null
        List<StorageDocument> duls = queryService.getDataUseLettersForConsent(restriction.getConsentGroupKey())
        Issue consent = queryService.findByKey(restriction.consentGroupKey)
        if (duls && duls.size() > 0) {
            dataUseLetter = storageProviderService.populateDocumentFileContent(duls.get(0))
        }
        try {
            ConsentResource resource = consentExportService.exportConsent(
                    getUser(),
                    restriction,
                    sampleCollectionIds,
                    dataUseLetter,
                    consent.summary)
            flash.message = "Consent successfully exported to DUOS: $resource.name"
        } catch (ConsentException e) {
            flash.error = e.message
        }
        redirect(controller: 'dataUse', action: "show", params: [id: restriction.id])
    }

    private String getConsentServiceUrl() {
        grailsApplication.config.consent.service.url
    }

}
