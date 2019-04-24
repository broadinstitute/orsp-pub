package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import org.grails.web.json.JSONArray

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

    DataUseRestriction createSdul(Object params, String displayName) {
        Issue consent = queryService.findByKey(params.consentGroupKey)
        def updatedOrCreated = "Updated"
        DataUseRestriction restriction = DataUseRestriction.findByConsentGroupKey(params.consentGroupKey)
        if (restriction == null) {
            restriction = new DataUseRestriction()
            updatedOrCreated = "Created"
        }
        restriction.consentGroupKey = params.consentGroupKey
        restriction.consentPIName = params.consentPIName
        restriction.generalUse = params.generalUse instanceof String ? getBooleanForParam(params.generalUse) :  params.generalUse
        restriction.hmbResearch = params.hmbResearch instanceof String ? getBooleanForParam(params.hmbResearch) : params.hmbResearch
        restriction.manualReview = params.manualReview instanceof String ? getBooleanForParam(params.manualReview) : params.manualReview

        restriction.diseaseRestrictions = new ArrayList<>()
        if (params.diseaseRestrictions) {
            if (params.diseaseRestrictions instanceof String[] || params.diseaseRestrictions instanceof JSONArray) {
                restriction.diseaseRestrictions.addAll(params.diseaseRestrictions.findAll { !it.isEmpty() })
            }
            else if (!params.diseaseRestrictions.isEmpty()) {
                restriction.setDiseaseRestrictions(Collections.singletonList((String) params.diseaseRestrictions))
            }
        }
        restriction.populationOriginsAncestry = params.populationOriginsAncestry instanceof String ? getBooleanForParam(params.populationOriginsAncestry) : params.populationOriginsAncestry
        restriction.commercialUseExcluded =  params.commercialUseExcluded instanceof String ? getBooleanForParam(params.commercialUseExcluded) :  params.commercialUseExcluded
        restriction.methodsResearchExcluded = params.methodsResearchExcluded instanceof String ? getBooleanForParam(params.methodsResearchExcluded) : params.methodsResearchExcluded
        restriction.aggregateResearchResponse = params.aggregateResearchResponse instanceof String ? getBooleanForParam(params.aggregateResearchResponse) : params.aggregateResearchResponse
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
        restriction.pediatricLimited = params.pediatric instanceof String ? getBooleanForParam(params.pediatric) : params.pediatric
        if (params.dateRestriction) {
            restriction.dateRestriction = Date.parse('MM/dd/yyyy', params.dateRestriction)
        } else {
            restriction.dateRestriction = null
        }
        restriction.recontactingDataSubjects = params.recontactingDataSubjects instanceof String ? getBooleanForParam(params.recontactingDataSubjects) : params.recontactingDataSubjects
        restriction.recontactMay = params.recontactMay
        restriction.recontactMust = params.recontactMust
        restriction.genomicPhenotypicData = params.genomicPhenotypicData
        restriction.cloudStorage = params.cloudStorage
        restriction.irb = params.irb instanceof String ? getBooleanForParam(params.irb) : params.irb
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
            persistenceService.saveEvent(consent.projectKey, displayName, "Data Use Restriction " + updatedOrCreated, null)
        } else {
            log.error("Unable to save restriction for some reason")
        }
        restriction
    }

    private Boolean getBooleanForParam(String param) {
        if ("Yes".equalsIgnoreCase(param) || "true".equalsIgnoreCase(param)) return true
        if ("No".equalsIgnoreCase(param) || "false".equalsIgnoreCase(param)) return false
        null
    }

}
