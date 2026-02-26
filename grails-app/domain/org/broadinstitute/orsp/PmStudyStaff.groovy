package org.broadinstitute.orsp

class PmStudyStaff {

    String projectKey
    String pm
    String pmType
    Integer sequenceNumber = 0
    String updateUser
    Date updateDate

    Issue issue

    static mapping = {
        table 'pm_study_staff'
        id column: 'pm_study_staff_id'
        issue column: 'issue_id'
        projectKey column: 'project_key'
        pmType column: 'pm_type'
        sequenceNumber column: 'sequence_number'
        updateUser column: 'update_user'
        updateDate column: 'update_date'
        version column: 'version'
    }

    static constraints = {
        issue nullable: false

        projectKey nullable: false, maxSize: 255
        pm nullable: true, maxSize: 50
        pmType nullable: true, inList: ['PRIMARY', 'SECONDARY']

        sequenceNumber nullable: true
        updateUser nullable: true, maxSize: 50
        updateDate nullable: true
    }
}
