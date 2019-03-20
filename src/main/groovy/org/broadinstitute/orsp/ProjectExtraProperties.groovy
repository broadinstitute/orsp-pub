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

        this.setSummary(project.getExtraPropertySummary() ? project.getExtraPropertySummary() : "")
        this.setSubjectProtection(project.getSubjectProtection() ? project.getSubjectProtection() : "")
        this.setProjectReviewApproved(project.getProjectReviewApproved() ? project.getProjectReviewApproved() : false)
        this.setProtocol(project.getProtocol() ? project.getProtocol() : "")
        this.setProjectTitle(project.getProjectTitle() ? project.getProjectTitle() : "")
        this.setProjectAvailability(project.getProjectAvailability() ? project.getProjectAvailability() : "")
        this.setEditDescription(project.getEditDescription() ? project.getEditDescription() : null)
        this.setDescribeEditType(project.getDescribeEditType() ? project.getDescribeEditType() : null)

        this.setCollaborators(project.getCollaborators())
        this.setPm(project.getPMs())
        this.setPi(project.getPIs())
        this.setActor(project.getActors())

        // Info Security
        this.setPii(project.getPII() ? project.getPII() : "")
        this.setCompliance(project.getCompliance() ? project.getCompliance() : "")
        this.setTextCompliance(project.getTextCompliance() ? project.getTextCompliance() : "")
        this.setSensitive(project.getSensitive() ? project.getSensitive() : "")
        this.setTextSensitive(project.getTextSensitive() ? project.getTextSensitive() : "")
        this.setAccessible(project.getAccessible() ? project.getAccessible() : "")
        this.setTextAccessible(project.getTextAccessible() ? project.getTextAccessible() : "")

        // Sharing data
        this.setSharingPlan(project.getSharingPlan() ? project.getSharingPlan() : "")
        this.setDatabaseControlled(project.getDataBaseControlled() ? project.getDataBaseControlled() : "")
        this.setDatabaseOpen(project.getDatabaseOpen() ? project.getDatabaseOpen() : "")

        // Determination questions
        this.setFeeForService(project.getFeeForService() ? project.getFeeForService() : "")
        this.setBroadInvestigator(project.getBroadInvestigator() ? project.getBroadInvestigator() : "")
        this.setSubjectsDeceased(project.getSubjectDeceased() ? project.getSubjectDeceased() : "")
        this.setSensitiveInformationSource(project.getSensitiveInformationSource() ? project.getSensitiveInformationSource() : "")
        this.setInteractionSource(project.getInteractionSource() ? project.getInteractionSource() : "")
        this.setIsIdReceive(project.getIsIdReceive() ? project.getIsIdReceive() : "")
        this.setIsCoPublishing(project.getIsCoPublishing() ? project.getIsCoPublishing() : "")
        this.setFederalFunding(project.getFederalFunding() ? project.getFederalFunding() : "")

        // InternationalCohorts
        this.setIndividualDataSourced(project.getIndividualDataSourced() ? project.getIndividualDataSourced() : "")
        this.setIsLinkMaintained(project.getIsLinkMaintained() ? project.getIsLinkMaintained() : "")
        this.setFeeForServiceWork(project.getFeeForServiceWork() ? project.getFeeForServiceWork() : "")
        this.setAreSamplesComingFromEEAA(project.areSamplesComingFromEEA() ? project.areSamplesComingFromEEA() : "")
        this.setIsCollaboratorProvidingGoodService(project.isCollaboratorProvidingGoodService() ? project.isCollaboratorProvidingGoodService() : "")
        this.setIsConsentUnambiguous(project.isConsentUnambiguous() ? project.isConsentUnambiguous() : "")
    }
}
