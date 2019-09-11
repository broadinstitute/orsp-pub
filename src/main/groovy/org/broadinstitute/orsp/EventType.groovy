package org.broadinstitute.orsp

/**
 * Reportable event types.
 *
 * Order is important for the QA report queries
 */
enum EventType {
    // Not currently in use
    CHANGE,
    STATUS,

    // Transition events
    INITIAL_STATE,
    GETTING_SIGNATURES,
    REVIEWING_FORM,
    IRB_CONSIDERING,
    GETTING_CCO_APPROVAL,
    APPROVED,
    COMPLETED,
    CLOSED,
    ABANDON,

    // Project Events
    SUBMIT_PROJECT,
    READ_PROJECT,
    APPROVE_PROJECT,
    REJECT_PROJECT,
    APPROVE_EDITS,
    ABANDON_PROJECT,
    DISAPPROVE_PROJECT,
    WITHDRAWN_PROJECT,
    REJECT_EDITS,
    SUBMIT_EDITS,
    REQUEST_CLARIFICATION,

    // Consent Events
    DUOS_CONSENT_CREATE,
    DUOS_CONSENT_UPDATE,
    DUOS_CONSENT_SAMPLES_EXPORT,
    DUOS_CONSENT_DUL_EXPORT,

    // Documents Events
    UPLOAD_DOCUMENT,
    APPROVE_DOCUMENT,
    REJECT_DOCUMENT,

    // Consent Group Events
    SUBMIT_CONSENT_GROUP,
    READ_CONSENT_GROUP,
    APPROVE_CONSENT_GROUP,
    REJECT_CONSENT_GROUP,

    // Data Use Letter Events
    SUBMIT_DUL,
    SEND_DUL_LINK_BY_EMAIL,
    COPY_DUL_LINK_TO_CLIPBOARD
}

