package org.broadinstitute.orsp

enum ProjectKeyDocument {

    IRB_APPROVAL('IRB Approval'),
    IBR_APPLICATION('IRB Application'),
    NHSR_APPLICATION('NHSR Application'),
    NE_APPROVAL('NE Approval'),
    NE_APPLICATION('NE Application'),
    CONSENT_DOCUMENT('Consent Document')

    String type

    ProjectKeyDocument(String type) {
        this.type = type
    }

    static String getType(String type) {
        ProjectKeyDocument found = values().find { it.type.equalsIgnoreCase(type) }
        found?.type ?: ""
    }
}