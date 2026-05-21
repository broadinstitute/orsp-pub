package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete

class KeyPerson implements LogicalDelete<KeyPerson> {

    String role
    String name
    String projectKey
    String otherRole
    Integer sequenceNumber = 0
    String createdUser
    Date updatedTimestamp
    String updateUser
    Date createdDate

    Issue issue

    static mapping = {
        table 'key_person'
        id column: 'key_person_id'
        issue column: 'issue_id'
        updatedTimestamp column: 'updated_timestamp', insertable: true, updatable: true
        createdDate column: 'created_date', insertable: true, updatable: true
        createdUser insertable: true, updatable: false
    }

    static constraints = {
        role nullable: false, maxSize: 50
        name nullable: false, maxSize: 150
        projectKey nullable: true, maxSize: 20
        otherRole nullable: true
        createdUser nullable: true, maxSize: 50
        updatedTimestamp nullable: true
        updateUser nullable: true, maxSize: 150
        createdDate nullable: true
    }
}
