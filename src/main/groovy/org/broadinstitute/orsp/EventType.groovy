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

    // Consent Events
    DUOS_CONSENT_CREATE,
    DUOS_CONSENT_UPDATE,
    DUOS_CONSENT_SAMPLES_EXPORT,
    DUOS_CONSENT_DUL_EXPORT

}
