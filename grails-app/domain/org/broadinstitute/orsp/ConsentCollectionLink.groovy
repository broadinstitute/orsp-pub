package org.broadinstitute.orsp

/**
 * This class represents the association between Consent Group, Project, and Optional Sample Collection.
 *
 * Created: 8/21/14
 *
 * @author <a href="mailto:grushton@broadinstitute.org">grushton</a>
 */
class ConsentCollectionLink {

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
