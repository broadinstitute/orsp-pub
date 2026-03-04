package org.broadinstitute.orsp

class PiStudyStaff {

    String projectKey
    String pi
    String piType
    Integer sequenceNumber = 0
    String updateUser
    Date updateDate

    Issue issue

    static mapping = {
        table 'pi_study_staff'
        id column: 'pi_study_staff_id'
        issue column: 'issue_id'
        projectKey column: 'project_key'
        piType column: 'pi_type'
        sequenceNumber column: 'sequence_number'
        updateUser column: 'update_user'
        updateDate column: 'update_date'
        version column: 'version'
    }

    static constraints = {
        issue nullable: false
        projectKey nullable: false, maxSize: 255
        pi nullable: true, maxSize: 50
        piType nullable: true, inList: ['PRIMARY', 'SECONDARY']
        sequenceNumber nullable: true
        updateUser nullable: true, maxSize: 50
        updateDate nullable: true
    }
}
