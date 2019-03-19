package org.broadinstitute.orsp

class ConsentGroupExtraProperties {
    // General Data
    String startDate = ""
    String endDate = ""
    String onGoingProcess = ""
    String source = ""
    String collInst = ""
    String collContact = ""
    String consent = ""
    String protocol = ""
    String institutionalSources = ""
    String describeConsentGroup = ""
    String requireMta = ""
    String projectReviewApproved = "false"

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

    // InternationalCohorts
    String individualDataSourced = ""
    String isLinkMaintained = ""
    String feeForServiceWork = ""
    String areSamplesComingFromEEAA = ""
    String isCollaboratorProvidingGoodService = ""
    String isConsentUnambiguous = ""

    transient ConsentGroupExtraProperties buildConsentGroupExtraProperties(Map<String, List<String>> extraPropsMap) {
        if(!extraPropsMap.isEmpty()) {
            // General Data
            this.setStartDate(extraPropsMap.get(IssueExtraProperty.START_DATE, [""]).first())
            this.setEndDate(extraPropsMap.get(IssueExtraProperty.END_DATE, [""]).first())
            this.setOnGoingProcess(extraPropsMap.get(IssueExtraProperty.ON_GOING_PROCESS, [""]).first())
            this.setSource(extraPropsMap.get(IssueExtraProperty.SOURCE, [""]).first())
            this.setCollInst(extraPropsMap.get(IssueExtraProperty.COLL_INST, [""]).first())
            this.setCollContact(extraPropsMap.get(IssueExtraProperty.COLL_CONTACT, [""]).first())
            this.setConsent(extraPropsMap.get(IssueExtraProperty.CONSENT, [""]).first())
            this.setProtocol(extraPropsMap.get(IssueExtraProperty.PROTOCOL, [""]).first())
            this.setInstitutionalSources(extraPropsMap.get(IssueExtraProperty.INSTITUTIONAL_SOURCES, [""]).first())
            this.setDescribeConsentGroup(extraPropsMap.get(IssueExtraProperty.DESCRIBE_CONSENT, [""]).first())
            this.setRequireMta(extraPropsMap.get(IssueExtraProperty.REQUIRE_MTA, [""]).first())
            this.setProjectReviewApproved(extraPropsMap.get(IssueExtraProperty.PROJECT_REVIEW_APPROVED, ["false"]).first())

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
