package org.broadinstitute.orsp

import grails.converters.JSON

class CrowdUserDetail {
    static {
        JSON.registerObjectMarshaller(CrowdUserDetail) {
            return it.properties.findAll {k,v -> k != 'class'}
        }
    }
    String userName
    String firstName
    String lastName
    String displayName
    String email
}
