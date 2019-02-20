package org.broadinstitute.orsp

enum ProjectKeyDocuments {

    IRB_APPROVAL('IRB Approval'),
    IBR_APPLICATION('IRB Application'),
    NHSR_APPLICATION('NHSR Application'),
    NE_APPROVAL('NE Approval'),
    NE_APPLICATION('NE Application'),
    CONSENT_DOCUMENT('Consent Document')

    String type

    ProjectKeyDocuments(String type) {
        this.type = type
    }

    static String getType(String type) {
        ProjectKeyDocuments found = values().find { it.type.equalsIgnoreCase(type) }
        found?.type ?: ""
    }
}