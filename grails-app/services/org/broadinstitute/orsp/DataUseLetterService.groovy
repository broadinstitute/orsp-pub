package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import org.broadinstitute.orsp.utils.DataUseRestrictionParser

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
        newDul.setDulInfo(input.getProperty("dulInfo"))
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

    DataUseRestriction saveRestriction(DataUseRestriction restriction, String displayName) {
        Issue consent = queryService.findByKey(restriction.consentGroupKey)
        String updatedOrCreated = (restriction.id == null) ? "Created" : "Updated"
        if (restriction.save(flush: true)) {
            persistenceService.saveEvent(consent.projectKey, displayName, "Data Use Restriction " + updatedOrCreated, null)
        } else {
            log.error("Unable to save restriction for some reason")
        }
        restriction
    }

    DataUseRestriction getRestrictionFromParams(Object params) {
        if (params.consentGroupKey) {
            DataUseRestriction existentRestriction = DataUseRestriction.findByConsentGroupKey(params.consentGroupKey)
            DataUseRestrictionParser.fromParams(existentRestriction, params)
        } else {
            throw new IllegalArgumentException('Consent Group is required')
        }
    }

}
