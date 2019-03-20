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
    String feeForServiceWork
    String areSamplesComingFromEEAA
    String isCollaboratorProvidingGoodService
    String isConsentUnambiguous

    ConsentGroupExtraProperties(Issue consentGroup) {
        // General Data
        this.setStartDate(consentGroup.getStartDate())
        this.setEndDate(consentGroup.getEndDate())
        this.setOnGoingProcess(consentGroup.getOnGoingProcess() ? consentGroup.getOnGoingProcess() : "")
        this.setSource(consentGroup.getSource() ? consentGroup.getSource() : "")
        this.setCollInst(consentGroup.getCollInst() ? consentGroup.getCollInst() : "")
        this.setCollContact(consentGroup.getCollContact() ? consentGroup.getCollContact() : "")
        this.setConsent(consentGroup.getConsent() ? consentGroup.getConsent() : "")
        this.setProtocol(consentGroup.getProtocol() ? consentGroup.getProtocol() : "")
        this.setInstitutionalSources(consentGroup.getInstitutionalSources() ? consentGroup.getInstitutionalSources() : "")
        this.setDescribeConsentGroup(consentGroup.getDescribeConsentGroup() ? consentGroup.getDescribeConsentGroup() : "")
        this.setRequireMta(consentGroup.getMTA() ? consentGroup.getMTA() : "")
        this.setProjectReviewApproved(consentGroup.getProjectReviewApproved() ? consentGroup.getProjectReviewApproved() : false)

        // Info Security
        this.setPii(consentGroup.getPII() ? consentGroup.getPII() : "")
        this.setCompliance(consentGroup.getCompliance() ? consentGroup.getCompliance() : "")
        this.setTextCompliance(consentGroup.getTextCompliance() ? consentGroup.getTextCompliance() : "")
        this.setSensitive(consentGroup.getSensitive() ? consentGroup.getSensitive() : "")
        this.setTextSensitive(consentGroup.getTextSensitive() ? consentGroup.getTextSensitive() : "")
        this.setAccessible(consentGroup.getAccessible() ? consentGroup.getAccessible() : "")
        this.setTextAccessible(consentGroup.getTextAccessible() ? consentGroup.getTextAccessible() : "")

        // Sharing data
        this.setSharingPlan(consentGroup.getSharingPlan() ? consentGroup.getSharingPlan() : "")
        this.setDatabaseControlled(consentGroup.getDataBaseControlled() ? consentGroup.getDataBaseControlled() : "")
        this.setDatabaseOpen(consentGroup.getDatabaseOpen() ? consentGroup.getDatabaseOpen() : "")

        // InternationalCohorts
        this.setIndividualDataSourced(consentGroup.getIndividualDataSourced() ? consentGroup.getIndividualDataSourced() : "")
        this.setIsLinkMaintained(consentGroup.getIsLinkMaintained() ? consentGroup.getIsLinkMaintained() : "")
        this.setFeeForServiceWork(consentGroup.getFeeForServiceWork() ? consentGroup.getFeeForServiceWork() : "")
        this.setAreSamplesComingFromEEAA(consentGroup.areSamplesComingFromEEA() ? consentGroup.areSamplesComingFromEEA() : "")
        this.setIsCollaboratorProvidingGoodService(consentGroup.isCollaboratorProvidingGoodService() ? consentGroup.isCollaboratorProvidingGoodService() : "")
        this.setIsConsentUnambiguous(consentGroup.isConsentUnambiguous() ? consentGroup.isConsentUnambiguous() : "")
    }
}
