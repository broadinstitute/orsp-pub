package org.broadinstitute.orsp

class VersionedPmStudyStaff {

    String projectKey
    String pm
    String pmType
    Integer sequenceNumber
    String updateUser
    Date updateDate

    VersionedIssue versionedIssue

    static mapping = {
        table 'versioned_pm_study_staff'
        id column: 'versioned_pm_study_staff_id'
        version false
        versionedIssue column: 'versioned_issue_id'
    }

    static constraints = {
        projectKey nullable: false, maxSize: 255
        pm nullable: false, maxSize: 50
        pmType nullable: false, inList: ['PRIMARY', 'SECONDARY']
        sequenceNumber nullable: false
        updateUser nullable: false, maxSize: 50
        updateDate nullable: false
    }
}
