package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete

class ConsentCollectionData implements LogicalDelete<ConsentCollectionData> {

    String projectKey
    String consentKey
    Boolean pii
    String requireMta
    String compliance
    String sharingType
    String textSharingType
    String textCompliance
    String internationalCohorts

    static constraints = {
        projectKey nullable: false
        consentKey nullable: false
        pii nullable: false
        requireMta nullable: false
        compliance nullable: false
        sharingType nullable: false
        textSharingType nullable: true
        textCompliance nullable: true
        internationalCohorts nullable: false
    }

}
