package org.broadinstitute.orsp

import grails.core.GrailsApplication
import org.broadinstitute.orsp.consent.ConsentResource

/**
 * Extend Base Controller with actions specific to Data Use Restrictions.
 */
class DataUseController extends AuthenticatedController {

    ConsentService consentService
    ConsentExportService consentExportService
    QueryService queryService
    GrailsApplication grailsApplication

    @Override
    show() {
        DataUseRestriction restriction = DataUseRestriction.findById(params.id)
        List<String> summary = consentService.getSummary(restriction)
        Issue consent = queryService.findByKey(restriction.consentGroupKey)
        String consentGroupName = consent.summary
        ConsentResource consentResource = consentService.buildConsentResource(restriction, consentGroupName)
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

    // TODO: Move db logic to service
    def save() {
        Issue consent = queryService.findByKey(params.consentGroupKey)
        DataUseRestriction restriction = new DataUseRestriction()

        if (!params.create) {
            restriction = DataUseRestriction.findById(params.id)
        }

        restriction.consentGroupKey = params.consentGroupKey
        restriction.consentPIName = params.consentPIName
        restriction.generalUse = getBooleanForParam(params.generalUse)
        restriction.hmbResearch = getBooleanForParam(params.hmbResearch)
        restriction.manualReview = getBooleanForParam(params.manualReview)

        restriction.diseaseRestrictions = new ArrayList<>()
        if (params.diseaseRestrictions) {
            if (params.diseaseRestrictions instanceof String[]) {
                restriction.diseaseRestrictions.addAll(params.diseaseRestrictions.findAll { !it.isEmpty() })
            }
            else if (!params.diseaseRestrictions.isEmpty()) {
                restriction.setDiseaseRestrictions(Collections.singletonList((String) params.diseaseRestrictions))
            }
        }

        restriction.populationOriginsAncestry = getBooleanForParam(params.populationOriginsAncestry)

        restriction.commercialUseExcluded = getBooleanForParam(params.commercialUseExcluded)
        restriction.methodsResearchExcluded = getBooleanForParam(params.methodsResearchExcluded)
        restriction.aggregateResearchResponse = params.aggregateResearchResponse
        if (params.gender) {
            if (params.gender.equals("NA")) restriction.gender = null
            else restriction.gender = params.gender
        } else {
            restriction.gender = null
        }
        restriction.controlSetOption = params.controlSetOption
        restriction.populationRestrictions = new ArrayList<>()
        if (params.populationRestrictions) {
            if (params.populationRestrictions instanceof String[]) {
                restriction.populationRestrictions.addAll(params.populationRestrictions.findAll { !it.isEmpty() })
            }
            else if (!params.populationRestrictions.isEmpty()) {
                restriction.populationRestrictions.add(params.populationRestrictions)
            }
        }
        restriction.pediatricLimited = getBooleanForParam(params.pediatric)
        if (params.dateRestriction) {
            restriction.dateRestriction = Date.parse('MM/dd/yyyy', params.dateRestriction)
        } else {
            restriction.dateRestriction = null
        }
        restriction.recontactingDataSubjects = getBooleanForParam(params.recontactingDataSubjects)
        restriction.recontactMay = params.recontactMay
        restriction.recontactMust = params.recontactMust
        restriction.genomicPhenotypicData = params.genomicPhenotypicData
        restriction.cloudStorage = params.cloudStorage
        restriction.irb = getBooleanForParam(params.irb)
        restriction.geographicalRestrictions = params.geographicalRestrictions

        if (params.other) {
            restriction.other = params.other
        } else {
            restriction.other = null
        }
        if (params.comments) {
            restriction.comments = params.comments
        } else {
            restriction.comments = null
        }

        if (restriction.save(flush: true)) {
            def updatedOrCreated = params.create ? "Created" : "Updated"
            persistenceService.saveEvent(consent.projectKey, getUser()?.displayName, "Data Use Restriction " + updatedOrCreated, null)
        } else {
            log.error("Unable to save restriction for some reason")
        }

        if (params.create) {
            redirect(controller: 'consentGroup', action: "show", params: [id: consent.projectKey, tab: 'documents'])
        } else {
            redirect(controller: 'dataUse', action: "show", params: [id: restriction.id])
        }
    }

    private static Boolean getBooleanForParam(String param) {
        if ("Yes".equalsIgnoreCase(param)) return true
        if ("No".equalsIgnoreCase(param)) return false
        null
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
