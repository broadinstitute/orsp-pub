package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete

class VersionedKeyPerson implements LogicalDelete<VersionedKeyPerson> {

    Long id
    String projectKey
    String role
    String name
    String otherRole
    Integer sequenceNumber
    String updateUser
    Date updateDate
    Boolean deleted = false

    VersionedIssue versionedIssue

    static mapping = {
        table 'versioned_key_person'
        id column: 'key_person_id'
        version column: 'version'
        versionedIssue column: 'versioned_issue_id'
        otherRole column: 'other_role', type: 'text'
        projectKey column: 'project_key'
        sequenceNumber column: 'sequence_number'
        updateUser column: 'update_user'
        updateDate column: 'update_date'
        deleted column: 'deleted'
    }

    static belongsTo = [versionedIssue: VersionedIssue]

    static constraints = {
        projectKey nullable: true, maxSize: 20
        role nullable: false, maxSize: 50
        name nullable: false, maxSize: 150
        otherRole nullable: true
        sequenceNumber nullable: false, min: 0
        updateUser nullable: true, maxSize: 150
        updateDate nullable: true
        versionedIssue nullable: false
        deleted nullable: false
    }
}
