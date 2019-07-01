package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete

/**
 * This class represents the association between Consent Group, Project, and Optional Sample Collection.
 */
class ConsentCollectionLink  implements LogicalDelete<ConsentCollectionLink> {

    String projectKey
    String consentKey
    String sampleCollectionId
    Date creationDate
    String pii
    String requireMta
    String compliance
    String sharingType
    String textSharingType
    String textCompliance
    String internationalCohorts
    Date startDate
    Date endDate
    Boolean onGoingProcess
    String status
    Issue linkedProject
    SampleCollection sampleCollection
    DataUseRestriction restriction

    static constraints = {
        projectKey nullable: false
        consentKey nullable: false
        sampleCollectionId nullable: true
        creationDate nullable: false
        pii nullable: true
        requireMta nullable: true
        compliance nullable: true
        sharingType nullable: true
        textSharingType nullable: true
        textCompliance nullable: true
        internationalCohorts nullable: true
        startDate nullable: true
        endDate nullable: true
        onGoingProcess nullable: true
        status nullable: true
    }

    static transients = ['linkedProject', 'sampleCollection', 'restriction']

    boolean getExpired() {
        (restriction && restriction.vaultExportDate < creationDate)
    }

}
