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
    Boolean projectReviewApproved

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
        this.setProjectReviewApproved(consentGroup.getProjectReviewApproved() ?: false)
    }
}
