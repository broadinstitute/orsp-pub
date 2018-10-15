package org.broadinstitute.orsp

import groovy.util.logging.Slf4j

@Slf4j
class AuthTagLib {

    static namespace= 'auth'

    /**
     * Renders the tag body when the user is authenticated in the application.
     */
    def isAuthenticated = { attributes, body ->
        if (session["user"]) {
            out << body()
        }
    }

    /**
     * Renders the tag body when the user is not authenticated in the application.
     */
    def isNotAuthenticated = { attributes, body ->
        if (!session["user"]) {
            out << body()
        }
    }

    /**
     * Renders the tag body when the user has one of the ORSP roles
     */
    def isOrsp = { attrs, body ->
        if (SupplementalRole.isOrsp(session["roles"] as Collection<String>)) {
            out << body()
        }
    }

    /**
     * Renders the tag body when the user does not have an ORSP role
     */
    def isNotOrsp = { attrs, body ->
        if (!SupplementalRole.isOrsp(session["roles"] as Collection<String>)) {
            out << body()
        }
    }

    /**
     * Renders the tag body when the user has the CCO role
     */
    def isCCO = { attrs, body ->
        if (SupplementalRole.isComplianceOffice(session["roles"] as Collection<String>)) {
            out << body()
        }
    }

    /**
     * Renders the tag body when the user does not have any of the ADMIN roles
     */
    def isNotAdmin = { attrs, body ->
        if (!SupplementalRole.isAdmin(session["roles"] as Collection<String>)) {
            out << body()
        }
    }

    def broadSession = { attributes, body ->
        if (session["user"] && session["isBroad"]) {
            out << body()
        }
    }

    def nonBroadSession = { attributes, body ->
        if (session["user"] && !session["isBroad"]) {
            out << body()
        }
    }

}
