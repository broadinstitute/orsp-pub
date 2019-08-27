package org.broadinstitute.orsp.utils

import liquibase.util.StringUtils
import org.broadinstitute.orsp.DataUseRestriction
import org.grails.web.json.JSONArray

class DataUseRestrictionParser {

    static DataUseRestriction fromParams(DataUseRestriction dataUseRestriction, Object params){
        dataUseRestriction = dataUseRestriction == null ? new DataUseRestriction() : dataUseRestriction
        dataUseRestriction.consentGroupKey = params.consentGroupKey
        dataUseRestriction.consentPIName = params.consentPIName
        dataUseRestriction.generalUse = params.generalUse instanceof Boolean ? params.generalUse : IssueUtils.getBooleanForParam(params.generalUse)
        dataUseRestriction.hmbResearch = params.hmbResearch instanceof Boolean ? params.hmbResearch : IssueUtils.getBooleanForParam(params.hmbResearch)
        dataUseRestriction.manualReview = params.manualReview instanceof Boolean ? params.manualReview : IssueUtils.getBooleanForParam(params.manualReview)
        dataUseRestriction.diseaseRestrictions = new ArrayList<>()
        if (params.diseaseRestrictions != null) {
            if (params.diseaseRestrictions instanceof String[] || params.diseaseRestrictions instanceof JSONArray) {
                dataUseRestriction.diseaseRestrictions.addAll(params.diseaseRestrictions.findAll { !it?.isEmpty() })
            }
            else if (!params.diseaseRestrictions.isEmpty()) {
                dataUseRestriction.setDiseaseRestrictions(Collections.singletonList((String) params.diseaseRestrictions))
            }
        }
        dataUseRestriction.populationOriginsAncestry = params.populationOriginsAncestry instanceof Boolean ? params.populationOriginsAncestry : IssueUtils.getBooleanForParam(params.populationOriginsAncestry)
        dataUseRestriction.commercialUseExcluded = params.commercialUseExcluded instanceof Boolean ? params.commercialUseExcluded : IssueUtils.getBooleanForParam(params.commercialUseExcluded)
        dataUseRestriction.methodsResearchExcluded = params.methodsResearchExcluded instanceof Boolean ? params.methodsResearchExcluded : IssueUtils.getBooleanForParam(params.methodsResearchExcluded)
        dataUseRestriction.aggregateResearchResponse = params.aggregateResearchResponse instanceof Boolean ? params.aggregateResearchResponse : IssueUtils.getBooleanForParam(params.aggregateResearchResponse)
        if (params.gender) {
            if (params.gender.equals("NA")) dataUseRestriction.gender = null
            else dataUseRestriction.gender = params.gender
        } else {
            dataUseRestriction.gender = null
        }
        dataUseRestriction.controlSetOption = params.controlSetOption
        dataUseRestriction.populationRestrictions = new ArrayList<>()
        if (params.populationRestrictions) {
            if (params.populationRestrictions instanceof String[]) {
                dataUseRestriction.populationRestrictions.addAll(params.populationRestrictions.findAll { !it.isEmpty() })
            }
            else if (!params.populationRestrictions.isEmpty()) {
                dataUseRestriction.populationRestrictions.add(params.populationRestrictions)
            }
        }
        dataUseRestriction.pediatricLimited = params.pediatric instanceof Boolean ? params.pediatric : IssueUtils.getBooleanForParam(params.pediatric)
        if (StringUtils.isNotEmpty(params.dateRestriction)) {
            dataUseRestriction.dateRestriction = Date.parse('MM/dd/yyyy', params.dateRestriction)
        } else {
            dataUseRestriction.dateRestriction = null
        }

        dataUseRestriction.recontactingDataSubjects = params.recontactingDataSubjects instanceof Boolean ? params.recontactingDataSubjects : IssueUtils.getBooleanForParam(params.recontactingDataSubjects)
        dataUseRestriction.recontactMay = params.recontactMay
        dataUseRestriction.recontactMust = params.recontactMust
        dataUseRestriction.genomicPhenotypicData = params.genomicPhenotypicData
        dataUseRestriction.cloudStorage = params.cloudStorage
        dataUseRestriction.irb =  params.irb instanceof Boolean ? params.irb : IssueUtils.getBooleanForParam(params.irb)
        dataUseRestriction.geographicalRestrictions = params.geographicalRestrictions

        dataUseRestriction.noRestriction = params.noRestriction instanceof Boolean ? params.noRestriction : IssueUtils.getBooleanForParam(params.noRestriction)

        if (dataUseRestriction.noRestriction) {
            dataUseRestriction.generalUse = true
        }

        dataUseRestriction.collaborationInvestigators = params.collaborationInvestigators instanceof Boolean ? params.collaborationInvestigators : IssueUtils.getBooleanForParam(params.collaborationInvestigators)
        dataUseRestriction.publicationResults = params.publicationResults instanceof Boolean ? params.publicationResults : IssueUtils.getBooleanForParam(params.publicationResults)
        dataUseRestriction.genomicResults = params.genomicResults instanceof Boolean ? params.genomicResults : IssueUtils.getBooleanForParam(params.genomicResults)
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
