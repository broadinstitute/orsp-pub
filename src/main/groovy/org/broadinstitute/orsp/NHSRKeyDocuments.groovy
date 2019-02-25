package org.broadinstitute.orsp

enum NHSRKeyDocuments {
    NHSR_APPLICATION('NHSR Application')

    NHSRKeyDocuments(String type) {
        this.type = type
    }

    static String getType(String type) {
        NHSRKeyDocuments found = values().find { it.type.equalsIgnoreCase(type) }
        found?.type ?: ""
    }

}