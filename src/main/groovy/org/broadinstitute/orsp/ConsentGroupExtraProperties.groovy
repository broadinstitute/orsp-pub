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
        this.setInstitutionalSources(consentGroup.getInstitutionalSources() ?: null)
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

        // InternationalCohorts
        this.setIndividualDataSourced(consentGroup.getIndividualDataSourced() ?: null)
        this.setIsLinkMaintained(consentGroup.getIsLinkMaintained() ?: null)
        this.setFeeForService(consentGroup.getFeeForService() ?: null)
        this.setAreSamplesComingFromEEAA(consentGroup.areSamplesComingFromEEA() ?: null)
        this.setIsCollaboratorProvidingGoodService(consentGroup.isCollaboratorProvidingGoodService() ?: null)
        this.setIsConsentUnambiguous(consentGroup.isConsentUnambiguous() ?: null)
    }
}
