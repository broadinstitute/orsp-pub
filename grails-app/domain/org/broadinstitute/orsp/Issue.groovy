package org.broadinstitute.orsp

import org.apache.commons.lang.StringUtils
import org.broadinstitute.orsp.utils.IssueUtils

class Issue {

    Integer id
    String projectKey
    String type
    String status
    String summary
    String description
    String reporter
    Date requestDate
    Date updateDate
    Date expirationDate

    static hasMany = [extraProperties: IssueExtraProperty, fundings: Funding]

    static constraints = {
        projectKey blank: false, nullable: false
        type blank: false, nullable: false
        status blank: false, nullable: false
        summary blank: false, nullable: false
        description blank: true, nullable: true
        reporter blank: true, nullable: true
        requestDate nullable: false
        updateDate nullable: true
        expirationDate nullable: true
    }

    // Transients

    static transients = ["actors", "attachments", "samples"]
    Collection<String> actors
    Collection<StorageDocument> attachments
    Collection<String> samples

    transient Boolean isLocked() { isFlagSet(IssueExtraProperty.LOCKED) }

    transient nonProjAttachTypes() {
        def existingFileTypes = [attachments*.fileType].flatten()
        def options = (type == IssueType.CONSENT_GROUP.name) ? ConsentGroupController.ATTACHMENT_TYPES : []
        if (options) {
            options -= existingFileTypes
        }
        if (type == IssueType.CONSENT_GROUP.name) {
            if (!options.contains(ConsentGroupController.IC_LETTER)) {
                options += ConsentGroupController.IC_LETTER
            }
            options += ConsentGroupController.ADDTL_ATTACHMENT_TYPES
        }
        return options
    }


    transient String getController() {
        IssueUtils.getControllerForIssueTypeName(type)
    }

    transient String getTypeLabel() {
        IssueType.valueOfName(type).label
    }

    transient isFlagSet(name) { getExtraProperties().find { (it.name == name) }?.value == "Yes" ?: false }

    transient String getConsent() { getExtraProperties().find { it.name == IssueExtraProperty.CONSENT }?.value }

    transient String getProtocol() { getExtraProperties().find { it.name == IssueExtraProperty.PROTOCOL }?.value }

    transient String getCollInst() { getExtraProperties().find { it.name == IssueExtraProperty.COLL_INST }?.value }

    transient String getCollContact() {
        getExtraProperties().find { it.name == IssueExtraProperty.COLL_CONTACT }?.value
    }

    transient String getCollPublication() {
        BooleanOptions.getLabelForKey(getExtraProperties().find {
            it.name == IssueExtraProperty.COLL_PUBLICATION
        }?.value?.toString())
    }

    transient String getCodedNotIdentifiable() { getExtraProperties().find { it.name == IssueExtraProperty.CODED_NOT_IDENTIFIABLE }?.value }

    transient String getDataSharingBroad() { getExtraProperties().find { it.name == IssueExtraProperty.DATA_SHARING_BROAD }?.value }

    transient String getDataSharingComments() { getExtraProperties().find { it.name == IssueExtraProperty.DATA_SHARING_COMMENTS }?.value }

    transient String getDataSharingNih() { getExtraProperties().find { it.name == IssueExtraProperty.DATA_SHARING_NIH }?.value }

    transient String getAwardNihHhs() { getExtraProperties().find { it.name == IssueExtraProperty.AWARD_NIH_HHS }?.value }

    transient String getNotHSR() { getExtraProperties().find { it.name == IssueExtraProperty.NOT_HSR }?.value }

    transient String getAccurate() {
        BooleanOptions.getLabelForKey(getExtraProperties().find {
            it.name == IssueExtraProperty.ACCURATE
        }?.value?.toString())
    }

    transient String getAffiliationOther() { getExtraProperties().find { it.name == IssueExtraProperty.AFFILIATION_OTHER }?.value }

    transient String getDbgap() { getExtraProperties().find { it.name == IssueExtraProperty.DBGAP }?.value?.toString() }

    transient String getCodes() { getExtraProperties().find { it.name == IssueExtraProperty.CODES }?.value }

    transient String getIrb() { getExtraProperties().find { it.name == IssueExtraProperty.IRB }?.value }

    transient String getRationale() { getExtraProperties().find { it.name == IssueExtraProperty.RATIONALE }?.value }

    transient String getResearch() { getExtraProperties().find { it.name == IssueExtraProperty.RESEARCH }?.value }

    transient String getResponsible() { getExtraProperties().find { it.name == IssueExtraProperty.RESPONSIBLE }?.value }

    transient String getSource() { getExtraProperties().find { it.name == IssueExtraProperty.SOURCE }?.value }

    transient String getIdentifiable() { getExtraProperties().find { it.name == IssueExtraProperty.IDENTIFIABLE }?.value }

    transient String getDeceased() { getExtraProperties().find { it.name == IssueExtraProperty.DECEASED }?.value }

    transient String getSubmissionType() { getExtraProperties().find { it.name == IssueExtraProperty.SUBMISSION_TYPE }?.value }

    transient String getFeeForService() { getExtraProperties().find { it.name == IssueExtraProperty.FEE_FOR_SERVICE }?.value }

    transient String getCollHasIdentity() { getExtraProperties().find { it.name == IssueExtraProperty.COLL_HAS_IDENTITY }?.value }

    transient String getReviewCategory() { getExtraProperties().find { it.name == IssueExtraProperty.REVIEW_CATEGORY }?.value }

    transient String getCommerciallyAvailable() { getExtraProperties().find { it.name == IssueExtraProperty.COMMERCIALLY_AVAILABLE }?.value }

    transient String getInteract() { getExtraProperties().find { it.name == IssueExtraProperty.INTERACT }?.value }

    transient Collection<String> getActorUsernames() { getExtraProperties().findAll { it.name == IssueExtraProperty.ACTOR }.collect { it.value } }

    transient Collection<String> getPIs() { getExtraProperties().findAll { it.name == IssueExtraProperty.PI }.collect { it.value } }

    transient Collection<String> getPMs() { getExtraProperties().findAll { it.name == IssueExtraProperty.PM }.collect { it.value } }

    transient Collection<String> getAffiliations() { getExtraProperties().findAll { it.name == IssueExtraProperty.AFFILIATIONS }.collect { it.value } }

    transient Collection<String> getNotResearch() { getExtraProperties().findAll { it.name == IssueExtraProperty.NOT_RESEARCH }.collect { it.value } }

    transient String getMTA() { getExtraProperties().find { it.name == IssueExtraProperty.REQUIRE_MTA }?.value }

    transient String areSamplesComingFromEEA() { getExtraProperties().find { it.name == IssueExtraProperty.ARE_SAMPLES_COMING_FROM_EEAA }?.value }

    transient String isCollaboratorProvidingGoodService() { getExtraProperties().find { it.name == IssueExtraProperty.IS_COLLABORATOR_PROVIDING_GOOD_SERVICE }?.value }

    transient String isConsentUnambiguous() { getExtraProperties().find { it.name == IssueExtraProperty.IS_CONSENT_UNAMBIGUOUS }?.value }

    transient String getPII() { getExtraProperties().find { it.name == IssueExtraProperty.PII }?.value }

    transient String getCompliance() { getExtraProperties().find { it.name == IssueExtraProperty.COMPLIANCE }?.value }

    transient String getTextCompliance() { getExtraProperties().find { it.name == IssueExtraProperty.TEXT_COMPLIANCE }?.value }

    transient String getSensitive() { getExtraProperties().find { it.name == IssueExtraProperty.SENSITIVE }?.value }

    transient String getTextSensitive() { getExtraProperties().find { it.name == IssueExtraProperty.TEXT_SENSITIVE }?.value }

    transient String getAccessible() { getExtraProperties().find { it.name == IssueExtraProperty.ACCESSIBLE }?.value }

    transient String getTextAccessible() { getExtraProperties().find { it.name == IssueExtraProperty.TEXT_ACCESSIBLE }?.value }


    // Some query-able properties reference keys in static maps with string values.
    // We need to pull those out for text-based searches.

    transient Collection<String> getAllIRBValues() { PreferredIrb.values().findAll { getIrb()?.contains(it.key) }.label }

    transient Collection<String> getAllExtraPropertyValues() {
        getAllIRBValues() +
                getExtraProperties()*.value
    }

    transient List<IssueExtraProperty> getNonEmptyExtraProperties() {
        List<IssueExtraProperty> properties = new ArrayList<>();
        getExtraProperties().each({
            if (StringUtils.isNotEmpty(it.value)) {
                properties.add(it)
            }

        })
        properties
    }

    transient LinkedHashMap<String, IssueExtraProperty> getExtraPropertiesMap() {
        LinkedHashMap<String, IssueExtraProperty> extraproperties = new LinkedHashMap<>()
        extraproperties.putAll(getExtraProperties().collectEntries{[(it.name):it.value]})
        extraproperties
    }

}
