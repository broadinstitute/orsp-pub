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
    String editDescription
    String describeEditType


    ConsentGroupExtraProperties(Issue consentGroup) {
        // General Data
        this.setSource(consentGroup.getSource() ?: "")
        this.setCollInst(consentGroup.getCollInst() ?: "")
        this.setCollContact(consentGroup.getCollContact() ?: "")
        this.setConsent(consentGroup.getConsent() ?: "")
        this.setProtocol(consentGroup.getProtocol() ?: "")
        this.setInstitutionalSources(consentGroup.getInstitutionalSources() ?: null)
        this.setProjectReviewApproved(consentGroup.getProjectReviewApproved() ?: false)
        this.setEditDescription(consentGroup.getEditDescription() ?: "")
        this.setDescribeEditType(consentGroup.getDescribeEditType() ?: "")
    }
}
