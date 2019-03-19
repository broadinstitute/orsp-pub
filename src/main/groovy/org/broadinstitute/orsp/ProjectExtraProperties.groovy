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
    List<String> pm
    List<String> pi
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
        if (extraPropsMap.containsKey(IssueExtraProperty.SUMMARY)) {
            this.setSummary(extraPropsMap[IssueExtraProperty.SUMMARY].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.SUBJECT_PROTECTION)) {
            this.setSubjectProtection(extraPropsMap[IssueExtraProperty.SUBJECT_PROTECTION].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.PROJECT_REVIEW_APPROVED)) {
            this.setProjectReviewApproved(extraPropsMap[IssueExtraProperty.PROJECT_REVIEW_APPROVED].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.PROTOCOL)) {
            this.setProtocol(extraPropsMap[IssueExtraProperty.PROTOCOL].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.PROJECT_TITLE)) {
            this.setProjectTitle(extraPropsMap[IssueExtraProperty.PROJECT_TITLE].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.PROJECT_AVAILABILITY)) {
            this.setProjectAvailability(extraPropsMap[IssueExtraProperty.PROJECT_AVAILABILITY].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.EDIT_DESCRIPTION)) {
            this.setEditDescription(extraPropsMap[IssueExtraProperty.EDIT_DESCRIPTION].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.DESCRIBE_EDIT_TYPE)) {
            this.setDescribeEditType(extraPropsMap[IssueExtraProperty.DESCRIBE_EDIT_TYPE].first())
        }
        if (extraPropsMap.containsKey("collaborators")) {
            this.setCollaborators(extraPropsMap[IssueExtraProperty.DESCRIBE_EDIT_TYPE])
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.PM)) {
            this.setPm(extraPropsMap[IssueExtraProperty.PM])
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.PI)) {
            this.setPi(extraPropsMap[IssueExtraProperty.PI])
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.ACTOR)) {
            this.setActor(extraPropsMap[IssueExtraProperty.ACTOR].first())
        }


        // Info Security
        if (extraPropsMap.containsKey(IssueExtraProperty.PII)) {
            this.setPii(extraPropsMap[IssueExtraProperty.PII].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.COMPLIANCE)) {
            this.setCompliance(extraPropsMap[IssueExtraProperty.COMPLIANCE].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.TEXT_COMPLIANCE)) {
            this.setTextCompliance(extraPropsMap[IssueExtraProperty.TEXT_COMPLIANCE].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.SENSITIVE)) {
            this.setSensitive(extraPropsMap[IssueExtraProperty.SENSITIVE].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.TEXT_SENSITIVE)) {
            this.setTextSensitive(extraPropsMap[IssueExtraProperty.TEXT_SENSITIVE].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.ACCESSIBLE)) {
            this.setAccessible(extraPropsMap[IssueExtraProperty.ACCESSIBLE].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.TEXT_ACCESSIBLE)) {
            this.setTextAccessible(extraPropsMap[IssueExtraProperty.TEXT_ACCESSIBLE].first())
        }


        // Sharing data
        if (extraPropsMap.containsKey(IssueExtraProperty.SHARING_PLAN)) {
            this.setSharingPlan(extraPropsMap[IssueExtraProperty.SHARING_PLAN].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.DATABASE_CONTROLLED)) {
            this.setDatabaseControlled(extraPropsMap[IssueExtraProperty.DATABASE_CONTROLLED].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.DATABASE_OPEN)) {
            this.setDatabaseOpen(extraPropsMap[IssueExtraProperty.DATABASE_OPEN].first())
        }

        // Determination questions
        if (extraPropsMap.containsKey(IssueExtraProperty.FEE_FOR_SERVICE)) {
            this.setFeeForService(extraPropsMap[IssueExtraProperty.FEE_FOR_SERVICE].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.BROAD_INVESTIGATOR)) {
            this.setBroadInvestigator(extraPropsMap[IssueExtraProperty.BROAD_INVESTIGATOR].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.SUBJECTS_DECEASED)) {
            this.setSubjectsDeceased(extraPropsMap[IssueExtraProperty.SUBJECTS_DECEASED].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.SENSITIVE_INFORMATION_SOURCE)) {
            this.setSensitiveInformationSource(extraPropsMap[IssueExtraProperty.SENSITIVE_INFORMATION_SOURCE].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.INTERACTION_SOURCE)) {
            this.setInteractionSource(extraPropsMap[IssueExtraProperty.INTERACTION_SOURCE].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.IS_ID_RECEIVE)) {
            this.setIsIdReceive(extraPropsMap[IssueExtraProperty.IS_ID_RECEIVE].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.IS_CO_PUBLISHING)) {
            this.setIsCoPublishing(extraPropsMap[IssueExtraProperty.IS_CO_PUBLISHING].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.FEDERAL_FUNDING)) {
            this.setFederalFunding(extraPropsMap[IssueExtraProperty.FEDERAL_FUNDING].first())
        }

        // InternationalCohorts
        if (extraPropsMap.containsKey(IssueExtraProperty.INDIVIDUAL_DATA_SOURCED)) {
            this.setIndividualDataSourced(extraPropsMap[IssueExtraProperty.INDIVIDUAL_DATA_SOURCED].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.IS_LINK_MAINTAINED)) {
            this.setIsLinkMaintained(extraPropsMap[IssueExtraProperty.IS_LINK_MAINTAINED].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.FEE_FOR_SERVICE_WORK)) {
            this.setFeeForServiceWork(extraPropsMap[IssueExtraProperty.FEE_FOR_SERVICE_WORK].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.ARE_SAMPLES_COMING_FROM_EEAA)) {
            this.setAreSamplesComingFromEEAA(extraPropsMap[IssueExtraProperty.ARE_SAMPLES_COMING_FROM_EEAA].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.IS_COLLABORATOR_PROVIDING_GOOD_SERVICE)) {
            this.setIsCollaboratorProvidingGoodService(extraPropsMap[IssueExtraProperty.IS_COLLABORATOR_PROVIDING_GOOD_SERVICE].first())
        }
        if (extraPropsMap.containsKey(IssueExtraProperty.IS_CONSENT_UNAMBIGUOUS)) {
            this.setIsConsentUnambiguous(extraPropsMap[IssueExtraProperty.IS_CONSENT_UNAMBIGUOUS].first())
        }
        return this
    }
}
