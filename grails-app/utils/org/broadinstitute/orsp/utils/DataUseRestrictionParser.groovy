package org.broadinstitute.orsp.utils

import liquibase.util.StringUtils
import org.broadinstitute.orsp.DataUseRestriction
import org.grails.web.json.JSONArray

class DataUseRestrictionParser {

    static DataUseRestriction fromParams(DataUseRestriction dataUseRestriction, Object params){
        dataUseRestriction = dataUseRestriction == null ? new DataUseRestriction() : dataUseRestriction
        dataUseRestriction.consentGroupKey = params.consentGroupKey
        dataUseRestriction.consentPIName = params.consentPIName
        dataUseRestriction.generalUse = IssueUtils.getBooleanForParam(params.generalUse)
        dataUseRestriction.hmbResearch = IssueUtils.getBooleanForParam(params.hmbResearch)
        dataUseRestriction.manualReview = IssueUtils.getBooleanForParam(params.manualReview)
        dataUseRestriction.diseaseRestrictions = new ArrayList<>()
        if (params.diseaseRestrictions != null) {
            if (params.diseaseRestrictions instanceof String[] || params.diseaseRestrictions instanceof JSONArray) {
                dataUseRestriction.diseaseRestrictions.addAll(params.diseaseRestrictions.findAll { !it?.isEmpty() })
            }
            else if (!params.diseaseRestrictions.isEmpty()) {
                dataUseRestriction.setDiseaseRestrictions(Collections.singletonList((String) params.diseaseRestrictions))
            }
        }
        dataUseRestriction.populationOriginsAncestry = IssueUtils.getBooleanForParam(params.populationOriginsAncestry)
        dataUseRestriction.commercialUseExcluded = IssueUtils.getBooleanForParam(params.commercialUseExcluded)
        dataUseRestriction.methodsResearchExcluded = IssueUtils.getBooleanForParam(params.methodsResearchExcluded)
        dataUseRestriction.aggregateResearchResponse = params.aggregateResearchResponse
        if (params.gender) {
            if (params.gender.equals("NA")) dataUseRestriction.gender = null
            else dataUseRestriction.gender = params.gender
        } else {
            dataUseRestriction.gender = null
        }
        dataUseRestriction.controlSetOption = params.controlSetOption
        dataUseRestriction.populationRestrictions = new ArrayList<>()
        if (params.populationRestrictions) {
            if (params.populationRestrictions instanceof String[] || params.populationRestrictions instanceof JSONArray) {
                dataUseRestriction.populationRestrictions.addAll(params.populationRestrictions.findAll { !it.isEmpty() })
            }
            else if (!params.populationRestrictions.isEmpty()) {
                dataUseRestriction.populationRestrictions.add(params.populationRestrictions)
            }
        }
        dataUseRestriction.pediatricLimited = IssueUtils.getBooleanForParam(params.pediatric)
        if (StringUtils.isNotEmpty(params.dateRestriction)) {
            dataUseRestriction.dateRestriction = Date.parse('MM/dd/yyyy', params.dateRestriction)
        } else {
            dataUseRestriction.dateRestriction = null
        }

        dataUseRestriction.recontactingDataSubjects = IssueUtils.getBooleanForParam(params.recontactingDataSubjects)
        dataUseRestriction.recontactMay = params.recontactMay
        dataUseRestriction.recontactMust = params.recontactMust
        dataUseRestriction.genomicPhenotypicData = params.genomicPhenotypicData
        dataUseRestriction.cloudStorage = params.cloudStorage
        dataUseRestriction.irb = IssueUtils.getBooleanForParam(params.irb)
        dataUseRestriction.geographicalRestrictions = params.geographicalRestrictions

        dataUseRestriction.noRestriction = IssueUtils.getBooleanForParam(params.noRestriction)

        if (dataUseRestriction.noRestriction) {
            dataUseRestriction.generalUse = true
        }

        dataUseRestriction.collaborationInvestigators = IssueUtils.getBooleanForParam(params.collaborationInvestigators)
        dataUseRestriction.publicationResults = IssueUtils.getBooleanForParam(params.publicationResults)
        dataUseRestriction.genomicResults = IssueUtils.getBooleanForParam(params.genomicResults)
        if (dataUseRestriction.genomicResults) {
            dataUseRestriction.genomicSummaryResults = (String)params.genomicSummaryResults
        } else {
            dataUseRestriction.genomicSummaryResults = null
        }

        if (params.other) {
            dataUseRestriction.other = params.other
        } else {
            dataUseRestriction.other = null
        }
        if (params.comments) {
            dataUseRestriction.comments = params.comments
        } else {
            dataUseRestriction.comments = null
        }
        dataUseRestriction
    }
}
