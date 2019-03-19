package org.broadinstitute.orsp

class ProjectExtraProperties {
    // General Data
    String summary = ""
    String subjectProtection = ""
    String projectReviewApproved = "false"
    String protocol = ""
    String projectTitle = ""
    String projectAvailability = ""
    String editDescription = ""
    String describeEditType = ""
    List<String> collaborators = []
    List<String> pm = []
    List<String> pi = []
    String actor = ""

    // Info Security
    String pii = ""
    String compliance = ""
    String textCompliance = ""
    String sensitive = ""
    String textSensitive = ""
    String accessible = ""
    String textAccessible = ""

    // Sharing data
    String sharingPlan = ""
    String databaseControlled = ""
    String databaseOpen = ""

    // Determination questions
    String feeForService = ""
    String broadInvestigator = ""
    String subjectsDeceased = ""
    String sensitiveInformationSource = ""
    String interactionSource = ""
    String isIdReceive = ""
    String isCoPublishing = ""
    String federalFunding = ""


    // InternationalCohorts
    String individualDataSourced = ""
    String isLinkMaintained = ""
    String feeForServiceWork = ""
    String areSamplesComingFromEEAA = ""
    String isCollaboratorProvidingGoodService = ""
    String isConsentUnambiguous = ""

    transient ProjectExtraProperties buildProjectExtraProps(Map<String, List<String>> extraPropsMap) {
        if(!extraPropsMap.isEmpty()) {
            // General Data
            this.setSummary(extraPropsMap.get(IssueExtraProperty.SUMMARY, [""]).first())
            this.setSubjectProtection(extraPropsMap.get(IssueExtraProperty.SUBJECT_PROTECTION, [""]).first())
            this.setProjectReviewApproved(extraPropsMap.get(IssueExtraProperty.PROJECT_REVIEW_APPROVED, ["false"]).first())
            this.setProtocol(extraPropsMap.get(IssueExtraProperty.PROTOCOL, [""]).first())
            this.setProjectTitle(extraPropsMap.get(IssueExtraProperty.PROJECT_TITLE, [""]).first())
            this.setProjectAvailability(extraPropsMap.get(IssueExtraProperty.PROJECT_AVAILABILITY, [""]).first())
            this.setEditDescription(extraPropsMap.get(IssueExtraProperty.EDIT_DESCRIPTION, [""]).first())
            this.setDescribeEditType(extraPropsMap.get(IssueExtraProperty.DESCRIBE_EDIT_TYPE, [""]).first())
            this.setCollaborators(extraPropsMap.get("collaborators", []))
            this.setPm(extraPropsMap.get(IssueExtraProperty.PM, []))
            this.setPi(extraPropsMap.get(IssueExtraProperty.PI, []))
            this.setActor(extraPropsMap.get(IssueExtraProperty.ACTOR, [""]).first())

            // Info Security
            this.setPii(extraPropsMap.get(IssueExtraProperty.PII, [""]).first())
            this.setCompliance(extraPropsMap.get(IssueExtraProperty.COMPLIANCE, [""]).first())
            this.setTextCompliance(extraPropsMap.get(IssueExtraProperty.TEXT_COMPLIANCE, [""]).first())
            this.setSensitive(extraPropsMap.get(IssueExtraProperty.SENSITIVE, [""]).first())
            this.setTextSensitive(extraPropsMap.get(IssueExtraProperty.TEXT_SENSITIVE, [""]).first())
            this.setAccessible(extraPropsMap.get(IssueExtraProperty.ACCESSIBLE, [""]).first())
            this.setTextAccessible(extraPropsMap.get(IssueExtraProperty.TEXT_ACCESSIBLE, [""]).first())

            // Sharing data
            this.setSharingPlan(extraPropsMap.get(IssueExtraProperty.SHARING_PLAN, [""]).first())
            this.setDatabaseControlled(extraPropsMap.get(IssueExtraProperty.DATABASE_CONTROLLED, [""]).first())
            this.setDatabaseOpen(extraPropsMap.get(IssueExtraProperty.DATABASE_OPEN, [""]).first())

            // Determination questions
            this.setFeeForService(extraPropsMap.get(IssueExtraProperty.FEE_FOR_SERVICE, [""]).first())
            this.setBroadInvestigator(extraPropsMap.get(IssueExtraProperty.BROAD_INVESTIGATOR, [""]).first())
            this.setSubjectsDeceased(extraPropsMap.get(IssueExtraProperty.SUBJECTS_DECEASED, [""]).first())
            this.setSensitiveInformationSource(extraPropsMap.get(IssueExtraProperty.SENSITIVE_INFORMATION_SOURCE, [""]).first())
            this.setInteractionSource(extraPropsMap.get(IssueExtraProperty.INTERACTION_SOURCE, [""]).first())
            this.setIsIdReceive(extraPropsMap.get(IssueExtraProperty.IS_ID_RECEIVE, [""]).first())
            this.setIsCoPublishing(extraPropsMap.get(IssueExtraProperty.IS_CO_PUBLISHING, [""]).first())
            this.setFederalFunding(extraPropsMap.get(IssueExtraProperty.FEDERAL_FUNDING, [""]).first())

            // InternationalCohorts
            this.setIndividualDataSourced(extraPropsMap.get(IssueExtraProperty.INDIVIDUAL_DATA_SOURCED, [""]).first())
            this.setIsLinkMaintained(extraPropsMap.get(IssueExtraProperty.IS_LINK_MAINTAINED, [""]).first())
            this.setFeeForServiceWork(extraPropsMap.get(IssueExtraProperty.FEE_FOR_SERVICE_WORK, [""]).first())
            this.setAreSamplesComingFromEEAA(extraPropsMap.get(IssueExtraProperty.ARE_SAMPLES_COMING_FROM_EEAA, [""]).first())
            this.setIsCollaboratorProvidingGoodService(extraPropsMap.get(IssueExtraProperty.IS_COLLABORATOR_PROVIDING_GOOD_SERVICE, [""]).first())
            this.setIsConsentUnambiguous(extraPropsMap.get(IssueExtraProperty.IS_CONSENT_UNAMBIGUOUS, [""]).first())
        }
        this
    }
}
