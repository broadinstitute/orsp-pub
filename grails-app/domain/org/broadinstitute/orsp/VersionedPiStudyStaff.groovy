package org.broadinstitute.orsp

class VersionedPiStudyStaff {

    String projectKey
    String pi
    String piType
    Integer sequenceNumber
    String updateUser
    Date updateDate

    VersionedIssue versionedIssue

    static mapping = {
        table 'versioned_pi_study_staff'
        id column: 'versioned_pi_study_staff_id'
        version false
        versionedIssue column: 'versioned_issue_id'
    }

    static constraints = {
        projectKey nullable: false, maxSize: 255
        pi nullable: false, maxSize: 50
        piType nullable: false, inList: ['PRIMARY', 'SECONDARY']
        sequenceNumber nullable: false
        updateUser nullable: false, maxSize: 50
        updateDate nullable: false
    }
}
