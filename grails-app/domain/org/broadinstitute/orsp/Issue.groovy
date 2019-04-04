package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete
import org.apache.commons.lang.StringUtils
import org.broadinstitute.orsp.utils.IssueUtils

class Issue implements LogicalDelete<Issue> {

    Integer id
    String projectKey
    String type
    String status
    String summary
    String description
    String reporter
    String approvalStatus
    Date requestDate
    Date updateDate
    Date expirationDate
    static final String DATA_USE_LETTER = "Data Use Letter"
    static final String CONSENT_DOCUMENT = "Consent Document"

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
        approvalStatus blank: false, nullable: false
    }

    // Transients

    static transients = ["actors", "attachments", "samples"]
    Collection<String> actors
    Collection<StorageDocument> attachments
    Collection<String> samples

    transient Boolean isLocked() { isFlagSet(IssueExtraProperty.LOCKED) }

    transient String getController() {
        IssueUtils.getControllerForIssueTypeName(type)
    }

    transient String getTypeLabel() {
        IssueType.valueOfName(type).label
    }

    transient isFlagSet(name) { getExtraProperties().find { (it.name == name) }?.value == "Yes" ?: false }

    // General Data
    transient String getSubjectProtection() { getExtraProperties().find { it.name == IssueExtraProperty.SUBJECT_PROTECTION }?.value }

    transient String getExtraPropertySummary() { getExtraProperties().find { it.name == IssueExtraProperty.SUMMARY }?.value }

    transient Boolean getProjectReviewApproved() { getExtraProperties().find { it.name == IssueExtraProperty.PROJECT_REVIEW_APPROVED }?.value }

    transient String getProtocol() { getExtraProperties().find { it.name == IssueExtraProperty.PROTOCOL }?.value }

    transient String getProjectTitle() { getExtraProperties().find { it.name == IssueExtraProperty.PROJECT_TITLE }?.value }

    transient String getProjectAvailability() { getExtraProperties().find { it.name == IssueExtraProperty.PROJECT_AVAILABILITY }?.value }

    transient String getEditDescription() { getExtraProperties().find { it.name == IssueExtraProperty.EDIT_DESCRIPTION}?.value }

    transient String getDescribeEditType() { getExtraProperties().find { it.name == IssueExtraProperty.DESCRIBE_EDIT_TYPE}?.value }

    transient Collection<String> getCollaborators() { getExtraProperties().findAll { it.name == IssueExtraProperty.COLLABORATOR }.collect { it.value } }

    transient Collection<String> getActorUsernames() { getExtraProperties().findAll { it.name == IssueExtraProperty.ACTOR }.collect { it.value } }

    transient Collection<String> getPIs() { getExtraProperties().findAll { it.name == IssueExtraProperty.PI }.collect { it.value } }

    transient Collection<String> getPMs() { getExtraProperties().findAll { it.name == IssueExtraProperty.PM }.collect { it.value } }

    transient String getStartDate() { getExtraProperties().find { it.name == IssueExtraProperty.START_DATE }?.value }

    transient String getEndDate() { getExtraProperties().find { it.name == IssueExtraProperty.END_DATE }?.value }

    transient String getOnGoingProcess() { getExtraProperties().find { it.name == IssueExtraProperty.ON_GOING_PROCESS }?.value }

    transient String getSource() { getExtraProperties().find { it.name == IssueExtraProperty.SOURCE }?.value }

    transient String getCollInst() { getExtraProperties().find { it.name == IssueExtraProperty.COLL_INST }?.value }

    transient String getCollContact() { getExtraProperties().find { it.name == IssueExtraProperty.COLL_CONTACT }?.value }

    transient String getConsent() { getExtraProperties().find { it.name == IssueExtraProperty.CONSENT }?.value }

    transient String getInstitutionalSources() { getExtraProperties().find { it.name == IssueExtraProperty.INSTITUTIONAL_SOURCES }?.value }

    transient String getDescribeConsentGroup() { getExtraProperties().find { it.name == IssueExtraProperty.DESCRIBE_CONSENT }?.value }

    transient String getMTA() { getExtraProperties().find { it.name == IssueExtraProperty.REQUIRE_MTA }?.value }

    transient String getUploadConsent() { getExtraProperties().find { it.name == IssueExtraProperty.UPLOAD_CONSENT_GROUP }?.value }

    transient String getIrbReferral() { getExtraProperties().find { it.name == IssueExtraProperty.IRB_REFERRAL }?.value }

    transient String getNotCGSpecify() { getExtraProperties().find { it.name == IssueExtraProperty.NOT_UPLOAD_CONSENT_GROUP_SPECIFY }?.value }

    // Info Security
    transient String getPII() { getExtraProperties().find { it.name == IssueExtraProperty.PII }?.value }

    transient String getCompliance() { getExtraProperties().find { it.name == IssueExtraProperty.COMPLIANCE }?.value }

    transient String getTextCompliance() { getExtraProperties().find { it.name == IssueExtraProperty.TEXT_COMPLIANCE }?.value }

    transient String getAccessible() { getExtraProperties().find { it.name == IssueExtraProperty.ACCESSIBLE }?.value }

    transient String getTextAccessible() { getExtraProperties().find { it.name == IssueExtraProperty.TEXT_ACCESSIBLE }?.value }

    // Sharing data
    transient String getSharingPlan() { getExtraProperties().find { it.name == IssueExtraProperty.SHARING_PLAN }?.value }

    transient String getDataBaseControlled() { getExtraProperties().find { it.name == IssueExtraProperty.DATABASE_CONTROLLED }?.value }

    transient String getDatabaseOpen() { getExtraProperties().find { it.name == IssueExtraProperty.DATABASE_OPEN }?.value }

    // Determination questions
    transient String getFeeForService() { getExtraProperties().find { it.name == IssueExtraProperty.FEE_FOR_SERVICE }?.value }

    transient String getBroadInvestigator() { getExtraProperties().find { it.name == IssueExtraProperty.BROAD_INVESTIGATOR }?.value }

    transient String getSubjectDeceased() { getExtraProperties().find { it.name == IssueExtraProperty.SUBJECTS_DECEASED }?.value }

    transient String getSensitiveInformationSource() { getExtraProperties().find { it.name == IssueExtraProperty.SENSITIVE_INFORMATION_SOURCE }?.value }

    transient String getInteractionSource() { getExtraProperties().find { it.name == IssueExtraProperty.INTERACTION_SOURCE }?.value }

    transient String getIsIdReceive() { getExtraProperties().find { it.name == IssueExtraProperty.IS_ID_RECEIVE }?.value }

    transient String getIsCoPublishing() { getExtraProperties().find { it.name == IssueExtraProperty.IS_CO_PUBLISHING }?.value }

    transient String getFederalFunding() { getExtraProperties().find { it.name == IssueExtraProperty.FEDERAL_FUNDING }?.value }

    // InternationalCohorts
    transient String getIndividualDataSourced() { getExtraProperties().find { it.name == IssueExtraProperty.INDIVIDUAL_DATA_SOURCED }?.value }

    transient String getIsLinkMaintained() { getExtraProperties().find { it.name == IssueExtraProperty.IS_LINK_MAINTAINED }?.value }

    transient String getFeeForServiceWork() { getExtraProperties().find { it.name == IssueExtraProperty.FEE_FOR_SERVICE_WORK }?.value }

    transient String areSamplesComingFromEEA() { getExtraProperties().find { it.name == IssueExtraProperty.ARE_SAMPLES_COMING_FROM_EEAA }?.value }

    transient String isCollaboratorProvidingGoodService() { getExtraProperties().find { it.name == IssueExtraProperty.IS_COLLABORATOR_PROVIDING_GOOD_SERVICE}?.value }

    transient String isConsentUnambiguous() { getExtraProperties().find { it.name == IssueExtraProperty.IS_CONSENT_UNAMBIGUOUS }?.value }

    // Others
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

    transient String getIdentifiable() { getExtraProperties().find { it.name == IssueExtraProperty.IDENTIFIABLE }?.value }

    transient String getDeceased() { getExtraProperties().find { it.name == IssueExtraProperty.DECEASED }?.value }

    transient String getSubmissionType() { getExtraProperties().find { it.name == IssueExtraProperty.SUBMISSION_TYPE }?.value }

    transient String getCollHasIdentity() { getExtraProperties().find { it.name == IssueExtraProperty.COLL_HAS_IDENTITY }?.value }

    transient String getReviewCategory() { getExtraProperties().find { it.name == IssueExtraProperty.REVIEW_CATEGORY }?.value }

    transient String getCommerciallyAvailable() { getExtraProperties().find { it.name == IssueExtraProperty.COMMERCIALLY_AVAILABLE }?.value }

    transient String getInteract() { getExtraProperties().find { it.name == IssueExtraProperty.INTERACT }?.value }

    transient Collection<String> getAffiliations() { getExtraProperties().findAll { it.name == IssueExtraProperty.AFFILIATIONS }.collect { it.value } }

    transient Collection<String> getNotResearch() { getExtraProperties().findAll { it.name == IssueExtraProperty.NOT_RESEARCH }.collect { it.value } }

    transient String getApproval() { getExtraProperties().find { it.name == IssueExtraProperty.APPROVAL }?.value }

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

    /**
     * Returns a map of IssueExtraProperty values for an issue, grouped by name.
     *
     * @return Map of extra properties, grouped by name
     */
    @SuppressWarnings("GroovyAssignabilityCheck")
    transient Map<String, List<String>> getExtraPropertiesMap() {
        Map<String, List<IssueExtraProperty>> propsByName = getExtraProperties().groupBy { it -> it.name }
        if (propsByName.containsKey(IssueExtraProperty.COLLABORATOR)) {
            List<IssueExtraProperty> props = propsByName.get(IssueExtraProperty.COLLABORATOR)
            propsByName.put("collaborators", props)
            propsByName.remove(IssueExtraProperty.COLLABORATOR)
        }
        propsByName.collectEntries { key, list ->
            [key, list*.value]
        }
    }

    /**
     * Determines if there's any status on attachments other than 'Approved', meaning
     * the issue still has unapproved or unreviewed attachments.
     *
     * @return True if all attachments have the 'Approved' status, false otherwise
     */
    transient Boolean attachmentsApproved() {
        ArrayList pendingDocuments = getAttachments().findAll {
            it.status == DocumentStatus.PENDING.status
        }.fileType
        pendingDocuments?.size() == 0
    }
}
