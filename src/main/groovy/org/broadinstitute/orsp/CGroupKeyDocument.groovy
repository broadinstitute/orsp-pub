package org.broadinstitute.orsp

enum CGroupKeyDocument {

    APPROVAL_MEMO('Approval Memo'),
    CONSENT_DOCUMENT('Consent Document'),
    DATA_USE_LETTER('Data Use Letter')

    String type

    CGroupKeyDocument(String type) {
        this.type = type
    }

    static String getType(String type) {
        CGroupKeyDocument found = values().find { it.type.equalsIgnoreCase(type) }
        found?.type ?: ""
    }
}