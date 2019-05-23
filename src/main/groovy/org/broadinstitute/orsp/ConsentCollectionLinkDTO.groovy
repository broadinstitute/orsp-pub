package org.broadinstitute.orsp

class ConsentCollectionLinkDTO {

    Long id
    String projectKey
    String consentKey
    String sampleCollectionId
    String pii
    String requireMta
    String compliance
    String sharingType
    String textSharingType
    String textCompliance
    String internationalCohorts
    String consentName
    String projectName
    String collectionName

    void setId(Number id) {
        this.id = id
    }
}
