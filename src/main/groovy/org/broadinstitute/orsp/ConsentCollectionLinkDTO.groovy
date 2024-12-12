package org.broadinstitute.orsp

class ConsentCollectionLinkDTO {

    Integer id
    String linkedProjectKey
    String consentKey
    String updatedBy
    String sampleCollectionId
    String questionnaireVersion
    Integer parentId
    Integer sequenceNumber
    String isLatest
    String pii
    String requireMta
    String compliance
    String sharingType
    String textSharingType
    String textCompliance
    String internationalCohorts
    String consentName
    String projectName
    String projectType
    String collectionName
    String collectionCategory
    String collectionGroup
    Date startDate
    Date endDate
    Boolean onGoingProcess
    String phi
    String piiDt
    String textStore
    String publiclyAvailable
    String store
    String externalAvailability
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
    String dataSecondaryUse
    String collaboratorApproval
    String mtaOrDta
    Date deliveryDate
    Date releaseDate

    void setId(Number id) {
        this.id = id
    }

    void setProjectType(String projectType) {
        this.projectType = IssueType.valueOfName(projectType).controller
    }
}
