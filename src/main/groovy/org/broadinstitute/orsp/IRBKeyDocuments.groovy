package org.broadinstitute.orsp

enum IRBKeyDocuments {

    IRB_APPROVAL('IRB Approval'),
    IBR_APPLICATION('IRB Application')

    String type

    IRBKeyDocuments(String type) {
        this.type = type
    }

    static String getType(String type) {
        IRBKeyDocuments found = values().find { it.type.equalsIgnoreCase(type) }
        found?.type ?: ""
    }
}