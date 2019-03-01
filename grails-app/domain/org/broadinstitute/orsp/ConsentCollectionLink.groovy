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

    Issue linkedProject
    SampleCollection sampleCollection
    DataUseRestriction restriction

    static constraints = {
        projectKey nullable: false
        consentKey nullable: false
        sampleCollectionId nullable: true
        creationDate nullable: false
    }

    static transients = ['linkedProject', 'sampleCollection', 'restriction']

    boolean getExpired() {
        (restriction && restriction.vaultExportDate < creationDate)
    }

}
