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

    static hasMany = [extraProperties: IssueExtraProperty, fundings: Funding]

    // Eagerly fetch associations
    static mapping = {
        extraProperties fetch: 'join'
        fundings fetch: 'join'
    }

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
        approvalStatus blank: true, nullable: true
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

    String getApprovalStatus() { approvalStatus != IssueStatus.Legacy.name ? approvalStatus : status }

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

    transient String getSource() { getExtraProperties().find { it.name == IssueExtraProperty.SOURCE }?.value }

    transient String getCollInst() { getExtraProperties().find { it.name == IssueExtraProperty.COLL_INST }?.value }

    transient String getCollContact() { getExtraProperties().find { it.name == IssueExtraProperty.COLL_CONTACT }?.value }

    transient String getConsent() { getExtraProperties().find { it.name == IssueExtraProperty.CONSENT }?.value }

    transient String getInstitutionalSources() { getExtraProperties().find { it.name == IssueExtraProperty.INSTITUTIONAL_SOURCES }?.value }

    transient String getUploadConsent() { getExtraProperties().find { it.name == IssueExtraProperty.UPLOAD_CONSENT_GROUP }?.value }

    transient String getIrbReferral() { getExtraProperties().find { it.name == IssueExtraProperty.IRB_REFERRAL }?.value }

    transient String getNotCGSpecify() { getExtraProperties().find { it.name == IssueExtraProperty.NOT_UPLOAD_CONSENT_GROUP_SPECIFY }?.value }

    // Determination questions
    transient String getFeeForService() { getExtraProperties().find { it.name == IssueExtraProperty.FEE_FOR_SERVICE }?.value }

    transient String getBroadInvestigator() { getExtraProperties().find { it.name == IssueExtraProperty.BROAD_INVESTIGATOR }?.value }

    transient String getSubjectDeceased() { getExtraProperties().find { it.name == IssueExtraProperty.SUBJECTS_DECEASED }?.value }

    transient String getSensitiveInformationSource() { getExtraProperties().find { it.name == IssueExtraProperty.SENSITIVE_INFORMATION_SOURCE }?.value }

    transient String getInteractionSource() { getExtraProperties().find { it.name == IssueExtraProperty.INTERACTION_SOURCE }?.value }

    transient String getIsIdReceive() { getExtraProperties().find { it.name == IssueExtraProperty.IS_ID_RECEIVE }?.value }

    transient String getIsCoPublishing() { getExtraProperties().find { it.name == IssueExtraProperty.IS_CO_PUBLISHING }?.value }

    transient String getFederalFunding() { getExtraProperties().find { it.name == IssueExtraProperty.FEDERAL_FUNDING }?.value }

    transient String getReviewedProtocol() { getExtraProperties().find { it.name == IssueExtraProperty.IRB_REVIEWED_PROTOCOL }?.value }

    transient String getHumanSubjects() { getExtraProperties().find { it.name == IssueExtraProperty.HUMAN_SUBJECTS }?.value }

    // Attestation
    transient String attestation() { getExtraProperties().find { it.name == IssueExtraProperty.ATTESTATION }?.value }

    // Admin Only
    transient String getIrbReferralText() { getExtraProperties().find { it.name == IssueExtraProperty.IRB_REFERRAL_TEXT }?.value }

    transient String getInvestigatorFirstName() { getExtraProperties().find { it.name == IssueExtraProperty.INVESTIGATOR_FIRST_NAME }?.value }

    transient String getInvestigatorLastName() { getExtraProperties().find { it.name == IssueExtraProperty.INVESTIGATOR_LAST_NAME }?.value }

    transient Collection<String> getDegrees() { getExtraProperties().findAll { it.name == IssueExtraProperty.DEGREE }.collect { it.value } }

    transient String getInitialDate() { getExtraProperties().find { it.name == IssueExtraProperty.INITIAL_DATE}?.value }

    transient String getInitialReviewType() { getExtraProperties().find { it.name == IssueExtraProperty.INITIAL_REVIEW_TYPE }?.value }

    transient String getBioMedical() { getExtraProperties().find { it.name == IssueExtraProperty.BIO_MEDICAL }?.value }

    transient String getIrbExpirationDate() { getExtraProperties().find { it.name == IssueExtraProperty.IRB_EXPIRATION_DATE}?.value }

    transient String getProjectStatus() { getExtraProperties().find { it.name == IssueExtraProperty.PROJECT_STATUS }?.value }

    transient String getAssignedAdmin() { getExtraProperties().find { it.name == IssueExtraProperty.ASSIGNED_ADMIN}?.value }

    transient String getAdminComments() { getExtraProperties().find { it.name == IssueExtraProperty.ADMIN_COMMENTS}?.value }

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

    transient String getCategoryTwo() { getExtraProperties().find { it.name == IssueExtraProperty.CATEGORY_TWO }?.value }
    transient String getExemptCategoryTwoI() { getExtraProperties().find { it.name == IssueExtraProperty.CATEGORY_TWO_I }?.value }
    transient String getExemptCategoryTwoII() { getExtraProperties().find { it.name == IssueExtraProperty.CATEGORY_TWO_II }?.value }
    transient String getExemptCategoryTwoIII() { getExtraProperties().find { it.name == IssueExtraProperty.CATEGORY_TWO_III }?.value }

    transient String getCategoryFour() { getExtraProperties().find { it.name == IssueExtraProperty.CATEGORY_FOUR }?.value }
    transient String getExemptCategoryFourI() { getExtraProperties().find { it.name == IssueExtraProperty.CATEGORY_FOUR_I }?.value }
    transient String getExemptCategoryFourII() { getExtraProperties().find { it.name == IssueExtraProperty.CATEGORY_FOUR_II }?.value }
    transient String getExemptCategoryFourIII() { getExtraProperties().find { it.name == IssueExtraProperty.CATEGORY_FOUR_III }?.value }
    transient String getExemptCategoryFourIV() { getExtraProperties().find { it.name == IssueExtraProperty.CATEGORY_FOUR_IV }?.value }

    transient String getNotEngagedCategories() { getExtraProperties().find { it.name == IssueExtraProperty.NOT_ENGAGED_CATEGORY }?.value }
    transient String getTextOtherNotEngagedCategory() { getExtraProperties().find { it.name == IssueExtraProperty.TEXT_OTHER_NOT_ENGAGED_CATEGORY }?.value }

    transient String getOtherCategory() { getExtraProperties().find { it.name == IssueExtraProperty.OTHER_CATEGORY }?.value }

    transient String getTextOtherCategory() { getExtraProperties().find { it.name == IssueExtraProperty.TEXT_OTHER_CATEGORY }?.value }

    transient String getApproval() { getExtraProperties().find { it.name == IssueExtraProperty.APPROVAL }?.value }


    // Some query-able properties reference keys in static maps with string values.
    // We need to pull those out for text-based searches.

    transient Collection<String> getAllIRBValues() { PreferredIrb.values().findAll { getIrb()?.contains(it.key) }.label }

    transient String getNoConsentFormReason() { getExtraProperties().find { it.name == IssueExtraProperty.NO_CONSENT_FORM_REASON }?.value }

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
