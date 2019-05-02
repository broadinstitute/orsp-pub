package org.broadinstitute.orsp.consent

import org.broadinstitute.orsp.utils.IssueUtils
import org.grails.web.json.JSONArray

class DataUseRestrictionDTO {

    String consentGroupKey
    String consentPIName
    Boolean generalUse
    Boolean hmbResearch
    Boolean manualReview
    List<String> diseaseRestrictions
    Boolean populationOriginsAncestry
    Boolean commercialUseExcluded
    Boolean methodsResearchExcluded
    Boolean aggregateResearchResponse
    String gender
    String controlSetOption
    List<String> populationRestrictions
    Boolean pediatric
    String dateRestriction
    Boolean recontactingDataSubjects
    String recontactMay
    String recontactMust
    String genomicPhenotypicData
    String cloudStorage
    Boolean irb
    String geographicalRestrictions
    String other
    String comments


    static DataUseRestrictionDTO fromParams(Object params){
        DataUseRestrictionDTO dataUseRestriction = new DataUseRestrictionDTO()
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
        dataUseRestriction.aggregateResearchResponse = IssueUtils.getBooleanForParam(params.aggregateResearchResponse)
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
        dataUseRestriction.pediatric = IssueUtils.getBooleanForParam(params.pediatric)
        dataUseRestriction.dateRestriction = params.dateRestriction

        dataUseRestriction.recontactingDataSubjects = IssueUtils.getBooleanForParam(params.recontactingDataSubjects)
        dataUseRestriction.recontactMay = params.recontactMay
        dataUseRestriction.recontactMust = params.recontactMust
        dataUseRestriction.genomicPhenotypicData = params.genomicPhenotypicData
        dataUseRestriction.cloudStorage = params.cloudStorage
        dataUseRestriction.irb = IssueUtils.getBooleanForParam(params.irb)
        dataUseRestriction.geographicalRestrictions = params.geographicalRestrictions
        if (params.other) {
            dataUseRestriction.other = params.other
        } else {
            dataUseRestriction.other = null
        }
        if (params.comments) {
            dataUseRestriction.comments = dataUseRestriction.comments
        } else {
            dataUseRestriction.comments = null
        }
        dataUseRestriction
    }

}

