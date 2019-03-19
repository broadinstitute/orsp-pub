package org.broadinstitute.orsp

class ProjectExtraProperties {
    // General Data
    String summary = ""
    String subjectProtection = ""
    String projectReviewApproved = ""
    String protocol = ""
    String projectTitle = ""
    String projectAvailability = ""
    String editDescription = ""
    String describeEditType = ""
    List<String> collaborators = []
    List<String> pm
    List<String> pi
    String actor = ""

    // Security info
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
        if (extraPropsMap.containsKey(IssueExtraProperty.SUMMARY)) {
            this.setSummary(extraPropsMap[IssueExtraProperty.SUMMARY].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.SUBJECT_PROTECTION)) {
            this.setSubjectProtection(extraPropsMap[IssueExtraProperty.SUBJECT_PROTECTION].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.PROJECT_REVIEW_APPROVED)) {
            this.setProjectReviewApproved(extraPropsMap[IssueExtraProperty.PROJECT_REVIEW_APPROVED].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.PROJECT_TITLE)) {
            this.setProjectTitle(extraPropsMap[IssueExtraProperty.PROJECT_TITLE].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.ACTOR)) {
            this.setActor(extraPropsMap[IssueExtraProperty.ACTOR].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.PII)) {
            this.setPii(extraPropsMap[IssueExtraProperty.PII].first())
        }

        // Add the rest of the project extra properties
        return this
    }
}
