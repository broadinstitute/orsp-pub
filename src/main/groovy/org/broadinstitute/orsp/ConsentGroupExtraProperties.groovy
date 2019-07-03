package org.broadinstitute.orsp

class ConsentGroupExtraProperties {
    // General Data
    String source
    String collInst
    String collContact
    String consent
    String protocol
    String institutionalSources
    Boolean projectReviewApproved

    ConsentGroupExtraProperties(Issue consentGroup) {
        // General Data
        this.setSource(consentGroup.getSource() ?: "")
        this.setCollInst(consentGroup.getCollInst() ?: "")
        this.setCollContact(consentGroup.getCollContact() ?: "")
        this.setConsent(consentGroup.getConsent() ?: "")
        this.setProtocol(consentGroup.getProtocol() ?: "")
        this.setInstitutionalSources(consentGroup.getInstitutionalSources() ?: null)
        this.setProjectReviewApproved(consentGroup.getProjectReviewApproved() ?: false)
    }
}
