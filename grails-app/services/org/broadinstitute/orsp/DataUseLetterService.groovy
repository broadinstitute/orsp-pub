package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import org.broadinstitute.orsp.consent.DataUseRestrictionDTO

class DataUseLetterService {
    QueryService queryService
    PersistenceService persistenceService

    @SuppressWarnings(["GroovyAssignabilityCheck"])
    DataUseLetter generateDul(DataUseLetter input) {
        DataUseLetter newDul = input

        String uniqueId = UUID.randomUUID().toString()
        newDul.setUid(uniqueId)

        newDul.setSubmitted(false)
        newDul.setCreationDate(new Date())

        newDul.save(flush: true)

        if (newDul.hasErrors()) {
            throw new DomainException(newDul.getErrors())
        } else {
            newDul
        }
    }

    @Transactional
    @SuppressWarnings(["GroovyAssignabilityCheck"])
    def udpateDataUseLetter(DataUseLetter input) {
        DataUseLetter dul = DataUseLetter.findByUid(input.getUid())
        dul.setDulInfo(input.getDulInfo())
        if (dul != null && !dul.submitted) {
            dul.setDulInfo(input.dulInfo as String)
            dul.save(flush:true)
            if (dul.hasErrors()) {
                throw new DomainException(dul.getErrors())
            }
            dul
        } else {
            throw new IllegalArgumentException()
        }
    }

    DataUseRestriction createSdul(DataUseRestrictionDTO restrictionDTO, String displayName) {
        Issue consent = queryService.findByKey(restrictionDTO.consentGroupKey)
        def updatedOrCreated = "Updated"
        DataUseRestriction restriction = DataUseRestriction.findByConsentGroupKey(restrictionDTO.consentGroupKey)
        if (restriction == null) {
            restriction = new DataUseRestriction()
            updatedOrCreated = "Created"
        }
        restriction.consentGroupKey = restrictionDTO.consentGroupKey
        restriction.consentPIName = restrictionDTO.consentPIName
        restriction.generalUse = restrictionDTO.generalUse
        restriction.hmbResearch = restrictionDTO.hmbResearch
        restriction.manualReview = restrictionDTO.manualReview
        restriction.diseaseRestrictions = restrictionDTO.diseaseRestrictions
        restriction.populationOriginsAncestry = restrictionDTO.populationOriginsAncestry
        restriction.commercialUseExcluded = restrictionDTO.commercialUseExcluded
        restriction.methodsResearchExcluded = restrictionDTO.methodsResearchExcluded
        restriction.aggregateResearchResponse = restrictionDTO.aggregateResearchResponse
        restriction.gender = restrictionDTO.gender
        restriction.controlSetOption = restrictionDTO.controlSetOption
        restriction.populationRestrictions = restrictionDTO.populationRestrictions
        restriction.pediatricLimited = restrictionDTO.pediatric
        if (restrictionDTO.dateRestriction) {
            restriction.dateRestriction = Date.parse('MM/dd/yyyy', restrictionDTO.dateRestriction)
        } else {
            restriction.dateRestriction = null
        }
        restriction.recontactingDataSubjects = restrictionDTO.recontactingDataSubjects
        restriction.recontactMay = restrictionDTO.recontactMay
        restriction.recontactMust = restrictionDTO.recontactMust
        restriction.genomicPhenotypicData = restrictionDTO.genomicPhenotypicData
        restriction.cloudStorage = restrictionDTO.cloudStorage
        restriction.irb = restrictionDTO.irb
        restriction.geographicalRestrictions = restrictionDTO.geographicalRestrictions
        restriction.other = restrictionDTO.other
        restriction.comments = restrictionDTO.comments
        if (restriction.save(flush: true)) {
            persistenceService.saveEvent(consent.projectKey, displayName, "Data Use Restriction " + updatedOrCreated, null)
        } else {
            log.error("Unable to save restriction for some reason")
        }
        restriction
    }


}
