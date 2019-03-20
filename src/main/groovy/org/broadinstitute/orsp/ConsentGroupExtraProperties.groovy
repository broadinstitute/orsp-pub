package org.broadinstitute.orsp

class ConsentGroupExtraProperties {
    // General Data
    String startDate
    String endDate
    String onGoingProcess
    String source
    String collInst
    String collContact
    String consent
    String protocol
    String institutionalSources
    String describeConsentGroup
    String requireMta
    Boolean projectReviewApproved

    // Info Security
    String pii
    String compliance
    String textCompliance
    String sensitive
    String textSensitive
    String accessible
    String textAccessible

    // Sharing data
    String sharingPlan
    String databaseControlled
    String databaseOpen

    // InternationalCohorts
    String individualDataSourced
    String isLinkMaintained
    String feeForService
    String areSamplesComingFromEEAA
    String isCollaboratorProvidingGoodService
    String isConsentUnambiguous

    ConsentGroupExtraProperties(Issue consentGroup) {
        // General Data
        this.setStartDate(consentGroup.getStartDate())
        this.setEndDate(consentGroup.getEndDate())
        this.setOnGoingProcess(consentGroup.getOnGoingProcess() ?: "")
        this.setSource(consentGroup.getSource() ?: "")
        this.setCollInst(consentGroup.getCollInst() ?: "")
        this.setCollContact(consentGroup.getCollContact() ?: "")
        this.setConsent(consentGroup.getConsent() ?: "")
        this.setProtocol(consentGroup.getProtocol() ?: "")
        this.setInstitutionalSources(consentGroup.getInstitutionalSources() ?: "")
        this.setDescribeConsentGroup(consentGroup.getDescribeConsentGroup() ?: "")
        this.setRequireMta(consentGroup.getMTA() ?: "")
        this.setProjectReviewApproved(consentGroup.getProjectReviewApproved() ?: false)

        // Info Security
        this.setPii(consentGroup.getPII() ?: "")
        this.setCompliance(consentGroup.getCompliance() ?: "")
        this.setTextCompliance(consentGroup.getTextCompliance() ?: "")
        this.setSensitive(consentGroup.getSensitive() ?: "")
        this.setTextSensitive(consentGroup.getTextSensitive() ?: "")
        this.setAccessible(consentGroup.getAccessible() ?: "")
        this.setTextAccessible(consentGroup.getTextAccessible() ?: "")

        // Sharing data
        this.setSharingPlan(consentGroup.getSharingPlan() ?: "")
        this.setDatabaseControlled(consentGroup.getDataBaseControlled() ?: "")
        this.setDatabaseOpen(consentGroup.getDatabaseOpen() ?: "")

        // InternationalCohorts
        this.setIndividualDataSourced(consentGroup.getIndividualDataSourced() ?: "")
        this.setIsLinkMaintained(consentGroup.getIsLinkMaintained() ?: "")
        this.setFeeForService(consentGroup.getFeeForService() ?: "")
        this.setAreSamplesComingFromEEAA(consentGroup.areSamplesComingFromEEA() ?: "")
        this.setIsCollaboratorProvidingGoodService(consentGroup.isCollaboratorProvidingGoodService() ?: "")
        this.setIsConsentUnambiguous(consentGroup.isConsentUnambiguous() ?: "")
    }
}
