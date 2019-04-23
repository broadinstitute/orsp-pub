package org.broadinstitute.orsp

/**
 * This class represents all of the restriction data that is collected for a Consent Group.
 * It also captures data relevant to its export status to DUOS.
 */
class DataUseRestriction {

    String consentGroupKey
    String consentPIName
    Boolean generalUse
    Boolean hmbResearch
    List<String> diseaseRestrictions
    Boolean populationOriginsAncestry
    Boolean commercialUseExcluded
    Boolean methodsResearchExcluded
    String aggregateResearchResponse
    String gender
    Boolean manualReview
    @Deprecated
    Boolean controlSetExcluded
    String controlSetOption // new version of controlSetExcluded that is a string, so can be unspecified
    String populationRestrictions
    Boolean pediatricLimited
    Date dateRestriction
    Boolean recontactingDataSubjects
    String recontactMay
    String recontactMust
    String genomicPhenotypicData
    @Deprecated
    Boolean otherRestrictions
    String cloudStorage
    Boolean irb
    String geographicalRestrictions
    String other
    String comments
    Date vaultExportDate
    String vaultConsentId
    String vaultConsentLocation
    Boolean noRestriction
    Boolean collaborationInvestigators
    Boolean publicationResults
    Boolean genomicResults
    String genomicSummaryResults

    static constraints = {
        consentGroupKey nullable: false, unique: true
        consentPIName nullable: false
        generalUse nullable: false
        hmbResearch nullable: true
        diseaseRestrictions nullable: true
        populationOriginsAncestry nullable: true
        commercialUseExcluded nullable: true
        methodsResearchExcluded nullable: true
        aggregateResearchResponse nullable: true
        gender nullable: true
        controlSetExcluded nullable: true
        controlSetOption nullable: true
        populationRestrictions nullable: true
        pediatricLimited nullable: true
        dateRestriction nullable: true
        recontactingDataSubjects nullable: true
        recontactMay nullable: true
        recontactMust nullable: true
        genomicPhenotypicData nullable: true
        otherRestrictions nullable: true
        cloudStorage nullable: true
        irb nullable: true
        geographicalRestrictions nullable: true
        other nullable: true
        manualReview nullable: true
        comments nullable: true
        noRestriction nullable: true
        collaborationInvestigators nullable: true
        publicationResults nullable: true
        genomicResults nullable: true
        genomicSummaryResults nullable: true

        vaultExportDate nullable: true
        vaultConsentId nullable: true
        vaultConsentLocation nullable: true
    }

    static hasMany = [diseaseRestrictions: String, populationRestrictions: String]

    String getConsentUrl(String serviceUrl) {
        serviceUrl + "/" + vaultConsentId
    }

}
