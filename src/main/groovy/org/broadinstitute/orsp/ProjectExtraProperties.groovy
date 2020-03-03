package org.broadinstitute.orsp

class ProjectExtraProperties {
    // General Data
    String summary
    String subjectProtection
    Boolean projectReviewApproved
    String protocol
    String projectTitle
    String projectAvailability
    String editDescription
    String describeEditType
    Collection<String> collaborators
    Collection<String> pm
    Collection<String> pi
    Collection actor
    String uploadConsentGroup
    String notCGSpecify
    String irb
    List<String> affiliations
    String affiliationOther

    // Determination questions
    String feeForService
    String broadInvestigator
    String subjectsDeceased
    String sensitiveInformationSource
    String interactionSource
    String isIdReceive
    String isCoPublishing
    String federalFunding
    String irbReviewedProtocol
    String humanSubjects

    // Attestation
    String attestation

    // Admin Only
    String irbReferralText
    String investigatorFirstName
    String investigatorLastName
    Collection<String> degrees
    String initialDate
    String initialReviewType
    String bioMedical
    String irbExpirationDate
    String projectStatus

    ProjectExtraProperties(Issue project) {
        // General Data
        this.setSummary(project.getExtraPropertySummary() ?: "")
        this.setSubjectProtection(project.getSubjectProtection() ?: "")
        this.setProjectReviewApproved(project.getProjectReviewApproved() ?: false)
        this.setProtocol(project.getProtocol() ?: "")
        this.setProjectTitle(project.getProjectTitle() ?: "")
        this.setProjectAvailability(project.getProjectAvailability() ?: "")
        this.setEditDescription(project.getEditDescription() ?: null)
        this.setDescribeEditType(project.getDescribeEditType() ?: null)
        this.setCollaborators(project.getCollaborators())
        this.setPm(project.getPMs())
        this.setPi(project.getPIs())
        this.setActor(project.getActors())
        this.setUploadConsentGroup(project.getUploadConsent() ?: "")
        this.setNotCGSpecify(project.getNotCGSpecify() ?: "")
        this.setIrb(project.getIrb() ?: null)
        this.setAffiliations(project.getAffiliations() ?: null)
        this.setAffiliationOther(project.getAffiliationOther() ?: "")

        // Determination questions
        this.setFeeForService(project.getFeeForService() ?: "")
        this.setBroadInvestigator(project.getBroadInvestigator() ?: "")
        this.setSubjectsDeceased(project.getSubjectDeceased() ?: "")
        this.setSensitiveInformationSource(project.getSensitiveInformationSource() ?: "")
        this.setInteractionSource(project.getInteractionSource() ?: "")
        this.setIsIdReceive(project.getIsIdReceive() ?: "")
        this.setIsCoPublishing(project.getIsCoPublishing() ?: "")
        this.setFederalFunding(project.getFederalFunding() ?: "")
        this.setIrbReviewedProtocol(project.getReviewedProtocol() ?: "")
        this.setHumanSubjects(project.getHumanSubjects() ?: "")

        // Attestation
        this.setAttestation(project.attestation() ?: null)

        // Admin Only
        this.setIrbReferralText(project.getIrbReferralText() ?: "")
        this.setInvestigatorFirstName(project.getInvestigatorFirstName() ?: "")
        this.setInvestigatorLastName(project.getInvestigatorLastName() ?: "")
        this.setDegrees(project.getDegrees() ?: [""])
        this.setInitialDate(project.getInitialDate() ?: null)
        this.setInitialReviewType(project.getInitialReviewType() ?: "")
        this.setBioMedical(project.getBioMedical() ?: "")
        this.setIrbExpirationDate(project.getIrbExpirationDate() ?: null)
        this.setProjectStatus(project.getProjectStatus() ?: "")
    }
}
