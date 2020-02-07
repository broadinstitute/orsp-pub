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
    String publiclyAvailable
    String store
    String externalAvailability
    String textStore
    String piiDt
    String phi
    String genomicData
    String names
    String dates
    String telephone
    String geographicData
    String fax
    String socialSecurityNumber
    String emailAddresses
    String medicalNumbers
    String accountNumbers
    String healthPlanNumbers
    String licenseNumbers
    String vehicleIdentifiers
    String webUrls
    String deviceIdentifiers
    String internetProtocolAddresses
    String facePhotos
    String biometricIdentifiers
    String uniqueIdentifying
    String otherIdentifier
    String textOtherIdentifier
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
        publiclyAvailable nullable: true
        store nullable: true
        externalAvailability nullable: true
        textStore nullable: true
        piiDt nullable: true
        phi nullable: true
        genomicData nullable: true
        names nullable: true
        dates nullable: true
        telephone nullable: true
        geographicData nullable: true
        fax nullable: true
        socialSecurityNumber nullable: true
        emailAddresses nullable: true
        medicalNumbers nullable: true
        accountNumbers nullable: true
        healthPlanNumbers nullable: true
        licenseNumbers nullable: true
        vehicleIdentifiers nullable: true
        webUrls nullable: true
        deviceIdentifiers nullable: true
        internetProtocolAddresses nullable: true
        facePhotos nullable: true
        biometricIdentifiers nullable: true
        uniqueIdentifying nullable: true
        otherIdentifier nullable: true
        textOtherIdentifier nullable: true

    }

    static transients = ['linkedProject', 'sampleCollection', 'restriction']

    boolean getExpired() {
        (restriction && restriction.vaultExportDate < creationDate)
    }

}
