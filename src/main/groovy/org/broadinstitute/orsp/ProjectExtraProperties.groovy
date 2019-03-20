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

        // Info Security
        this.setPii(project.getPII() ?: "")
        this.setCompliance(project.getCompliance() ?: "")
        this.setTextCompliance(project.getTextCompliance() ?: "")
        this.setSensitive(project.getSensitive() ?: "")
        this.setTextSensitive(project.getTextSensitive() ?: "")
        this.setAccessible(project.getAccessible() ?: "")
        this.setTextAccessible(project.getTextAccessible() ?: "")

        // Sharing data
        this.setSharingPlan(project.getSharingPlan() ?: "")
        this.setDatabaseControlled(project.getDataBaseControlled() ?: "")
        this.setDatabaseOpen(project.getDatabaseOpen() ?: "")

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
        this.setIndividualDataSourced(project.getIndividualDataSourced() ?: "")
        this.setIsLinkMaintained(project.getIsLinkMaintained() ?: "")
        this.setFeeForServiceWork(project.getFeeForServiceWork() ?: "")
        this.setAreSamplesComingFromEEAA(project.areSamplesComingFromEEA() ?: "")
        this.setIsCollaboratorProvidingGoodService(project.isCollaboratorProvidingGoodService() ?: "")
        this.setIsConsentUnambiguous(project.isConsentUnambiguous() ?: "")
    }
}
