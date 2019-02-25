package org.broadinstitute.orsp

enum NEKeyDocuments {
    NE_APPROVAL('NE Approval'),
    NE_APPLICATION('NE Application'),
    CONSENT_DOCUMENT('Consent Document')

    String type

    NEKeyDocuments(String type) {
        this.type = type
    }

    static String getType(String type) {
        NEKeyDocuments found = values().find { it.type.equalsIgnoreCase(type) }
        found?.type ?: ""
    }
}