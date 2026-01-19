package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete

class KeyPerson implements LogicalDelete<KeyPerson> {

    String role
    String name
    String projectKey
    String otherRole
    Integer sequenceNumber = 0
    String updateUser
    Date updateDate

    Issue issue

    static mapping = {
        table 'key_person'
        id column: 'key_person_id'
        issue column: 'issue_id'
    }

    static constraints = {
        role nullable: false, maxSize: 50
        name nullable: false, maxSize: 150
        projectKey nullable: true, maxSize: 20
        otherRole nullable: true
        updateUser nullable: true, maxSize: 150
        updateDate nullable: true
    }
}
