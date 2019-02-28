package org.broadinstitute.orsp

enum KeyDocuments {

    APPROVAL_MEMO('Approval Memo', 'Consent Group', false),
    DATA_USE_LETTER('Data Use Letter','Consent Group', true),
    CONSENT_DOCUMENT('Consent Document', 'Consent Group', false),
    NE_APPROVAL('NE Approval', "'Not Engaged' Project", false),
    NE_APPLICATION('NE Application', "'Not Engaged' Project", false),
    NE_CONSENT_DOCUMENT('Consent Document', "'Not Engaged' Project", true),
    NHSR_APPLICATION('NHSR Application', 'NHSR Project', false),
    IRB_APPROVAL('IRB Approval', "IRB Project", false),
    IBR_APPLICATION('IRB Application', "IRB Project", false)

    String value
    String type
    Boolean optional

    KeyDocuments(String value, String type, Boolean optional) {
        this.type = type
        this.value = value
        this.optional = optional
    }

    static Collection<KeyDocuments> getRequiredEnumByType(String type) {
        Collection<KeyDocuments> found = values().findAll { it.type.equalsIgnoreCase(type) && !it.optional }
        found
    }

}
