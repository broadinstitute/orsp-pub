package org.broadinstitute.orsp

enum ProjectCGTypes {
    PROJECT("Project"),
    CONSENT_GROUP("Consent Group")

    String name

    ProjectCGTypes(String name) {
        this.name = name
    }

}