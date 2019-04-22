package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete

/**
 * Properties on an issue.
 */
class IssueExtraProperty  implements LogicalDelete<IssueExtraProperty> {

    public static final String COMMERCIALLY_AVAILABLE = "commercially-available"
    public static final String REVIEW_CATEGORY = "review-category"
    public static final String SUMMARY = "summary"
    public static final String CONSENT = "consent"
    public static final String PROTOCOL = "protocol"
    public static final String COLL_INST = "collInst"
    public static final String COLL_CONTACT = "collContact"
    public static final String COLL_PUBLICATION = "collPublication"
    public static final String ACCURATE = "accurate"
    public static final String AFFILIATIONS = "affiliations"
    public static final String AFFILIATION_OTHER = "affiliationOther"
    public static final String DBGAP = "dbgap"
    public static final String DESCRIPTION = "description"
    public static final String CODES = "codes"
    public static final String IRB = "irb"
    public static final String RATIONALE = "rationale"
    public static final String RESEARCH = "research"
    public static final String RESPONSIBLE = "responsible"
    public static final String PI = "pi"
    public static final String PM = "pm"
    public static final String SOURCE = "source"
    public static final String ACTOR = "actor"
    public static final String PROJECT_QUESTIONNAIRE = "questions"
    public static final String PROJECT_TITLE = "projectTitle"
    public static final String IDENTIFIABLE = "identifiable"
    public static final String DECEASED = "deceased"
    public static final String SUBMISSION_TYPE = "submissionType"
    public static final String FEE_FOR_SERVICE = "feeForService"
    public static final String FEE_FOR_SERVICE_WORK = "feeForServiceWork"
    public static final String BROAD_INVESTIGATOR = "broadInvestigator"
    public static final String SUBJECTS_DECEASED = "subjectsDeceased"
    public static final String INTERACTION_SOURCE = "interactionSource"
    public static final String IS_ID_RECEIVE = "isIdReceive"
    public static final String IS_CO_PUBLISHING = "isCoPublishing"
    public static final String FEDERAL_FUNDING = "federalFunding"
    public static final String COLL_HAS_IDENTITY = "collHasIdentity"
    public static final String INTERACT = "interact"
    public static final String CODED_NOT_IDENTIFIABLE = "codedNotIdentifiable"
    public static final String AWARD_NIH_HHS = "awardNihHhs"
    public static final String NOT_RESEARCH = "notResearch"
    public static final String NOT_HSR = "notHSR"
    public static final String DATA_SHARING_BROAD = "dataSharingBroad"
    public static final String DATA_SHARING_COMMENTS = "dataSharingComments"
    public static final String DATA_SHARING_NIH = "dataSharingNih"
    public static final String COLLABORATOR = "collaborator"
    public static final String UPLOAD_CONSENT_GROUP = "uploadConsentGroup"
    public static final String IRB_REFERRAL = "irbReferral"
    public static final String NOT_UPLOAD_CONSENT_GROUP_SPECIFY = "notCGSpecify"
    public static final String SUBJECT_PROTECTION = "subjectProtection"
    public static final String REQUIRE_MTA = "requireMta"
    public static final String ARE_SAMPLES_COMING_FROM_EEAA = "areSamplesComingFromEEAA"
    public static final String IS_COLLABORATOR_PROVIDING_GOOD_SERVICE = "isCollaboratorProvidingGoodService"
    public static final String IS_CONSENT_UNAMBIGUOUS = "isConsentUnambiguous"
    public static final String PII = "pii"
    public static final String COMPLIANCE = "compliance"
    public static final String TEXT_COMPLIANCE = "textCompliance"
    public static final String SENSITIVE_INFORMATION_SOURCE = "sensitiveInformationSource"
    public static final String SHARING_TYPE = "sharingType"
    public static final String TEXT_SHARING_TYPE = "textSharingType"
    public static final String PROJECT_REVIEW_APPROVED = "projectReviewApproved"
    public static final String APPROVAL = "approvalStatus"
    public static final String PROJECT_AVAILABILITY = "projectAvailability"
    public static final String EDIT_DESCRIPTION = "editDescription"
    public static final String DESCRIBE_EDIT_TYPE = "describeEditType"
    public static final String ON_GOING_PROCESS = "onGoingProcess"
    public static final String SAMPLES = "samples"
    public static final String INSTITUTIONAL_SOURCES = "institutionalSources"
    public static final String DESCRIBE_CONSENT = "describeConsentGroup"
    public static final String INDIVIDUAL_DATA_SOURCED = "individualDataSourced"
    public static final String IS_LINK_MAINTAINED = "isLinkMaintained"
    public static final String START_DATE = "startDate"
    public static final String END_DATE = "endDate"
    public static final String ATTESTATION = "attestation"

    // Admin Only
    public static final String IRB_REFERRAL_TEXT = "irbReferralText"
    public static final String INVESTIGATOR_FIRST_NAME = "investigatorFirstName"
    public static final String INVESTIGATOR_LAST_NAME = "investigatorLastName"
    public static final String DEGREE = "degree"
    public static final String INITIAL_DATE = "initialDate"
    public static final String INITIAL_REVIEW_TYPE = "initialReviewType"
    public static final String BIO_MEDICAL = "bioMedical"
    public static final String PROJECT_STATUS = "projectStatus"

    // Status Flags
    public static final String APP_SUBMITTED_FLAG = "appSubmitted"
    public static final String APP_MOD_REQUESTED_FLAG = "appModRequested"
    public static final String APP_REVIEWED_FLAG = "appReviewed"
    public static final String APP_ACCEPTED_FLAG = "appAccepted"
    public static final String APP_SIGNED_FLAG = "appSigned"
    public static final String IRB_MOD_REQUESTED_FLAG = "irbModRequested"
    public static final String SUPPORT_SUBMITTED_FLAG = "supportSubmitted"
    public static final String SUP_MOD_REQUESTED_FLAG = "supModRequested"
    public static final String SUPPORT_REVIEWED_FLAG = "supportReviewed"
    public static final String SUPPORT_ACCEPTED_FLAG = "supportAccepted"
    public static final String PROJ_MOD_REQUESTED = "projModRequested"
    public static final String PROJ_REVIEWED = "projReviewed"
    public static final String PROJ_SUBMITTED = "projSubmitted"
    public static final String PROJ_ORSP_ACCEPTED = "projOrspAccepted"
    public static final String PROJ_CO_ACCEPTED = "projCoAccepted"
    public static final String LOCKED = "locked"
    public static final String ORSP_ENTERED_FLAG = "orspEntered"

    String name
    String value
    String projectKey

    Issue issue

    static mapping = {
        issue column: 'issue_id'
    }

}
