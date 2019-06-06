package org.broadinstitute.orsp

import groovy.json.JsonBuilder

class User implements Serializable {

    Integer id
    String userName
    String displayName
    String emailAddress
    Date createdDate
    Date updatedDate
    Date lastLoginDate

    static mapping = {
        table 'user'
        cache true
        version false
    }

    static hasMany = [roles: SupplementalRole]

    static constraints = {
        userName blank: false, nullable: false
        emailAddress blank: false, nullable: false
        lastLoginDate nullable: true
    }

}
