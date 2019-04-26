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
    String irbReferral

    // Info Security
    String pii
    String compliance
    String textCompliance
    String sharingType
    String textSharingType

    // Determination questions
    String feeForService
    String broadInvestigator
    String subjectsDeceased
    String sensitiveInformationSource
    String interactionSource
    String isIdReceive
    String isCoPublishing
    String federalFunding


    // InternationalCohorts
    String individualDataSourced
    String isLinkMaintained
    String feeForServiceWork
    String areSamplesComingFromEEAA
    String isCollaboratorProvidingGoodService
    String isConsentUnambiguous
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
        this.setIrbReferral(project.getIrbReferral() ?: null)

        // Info Security
        this.setPii(project.getPII() ?: "")
        this.setCompliance(project.getCompliance() ?: "")
        this.setTextCompliance(project.getTextCompliance() ?: "")
        this.setSharingType(project.getSharingType() ?: "")
        this.setTextSharingType(project.getTextSharingType() ?: "")

        // Determination questions
        this.setFeeForService(project.getFeeForService() ?: "")
        this.setBroadInvestigator(project.getBroadInvestigator() ?: "")
        this.setSubjectsDeceased(project.getSubjectDeceased() ?: "")
        this.setSensitiveInformationSource(project.getSensitiveInformationSource() ?: "")
        this.setInteractionSource(project.getInteractionSource() ?: "")
        this.setIsIdReceive(project.getIsIdReceive() ?: "")
        this.setIsCoPublishing(project.getIsCoPublishing() ?: "")
        this.setFederalFunding(project.getFederalFunding() ?: "")

        // InternationalCohorts
        this.setIndividualDataSourced(project.getIndividualDataSourced() ?: null)
        this.setIsLinkMaintained(project.getIsLinkMaintained() ?: null)
        this.setFeeForServiceWork(project.getFeeForServiceWork() ?: null)
        this.setAreSamplesComingFromEEAA(project.areSamplesComingFromEEA() ?: null)
        this.setIsCollaboratorProvidingGoodService(project.isCollaboratorProvidingGoodService() ?: null)
        this.setIsConsentUnambiguous(project.isConsentUnambiguous() ?: null)

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
