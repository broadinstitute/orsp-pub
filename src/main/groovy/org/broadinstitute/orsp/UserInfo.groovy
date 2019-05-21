package org.broadinstitute.orsp

import grails.web.api.ServletAttributes
import groovy.transform.CompileStatic

@CompileStatic
trait UserInfo implements ServletAttributes {

    boolean isAdmin() {
        if (session["roles"]) {
            SupplementalRole.isAdmin(session["roles"] as Collection<String>)
        } else {
            false
        }
    }

    boolean isORSP() {
        if (session["roles"]) {
            SupplementalRole.isOrsp(session["roles"] as Collection<String>)
        } else {
            false
        }
    }

    boolean isComplianceOffice() {
        if (session["roles"]) {
            SupplementalRole.isComplianceOffice(session["roles"] as Collection<String>)
        } else {
            false
        }
    }

    boolean isViewer() {
        if (session["roles"]) {
            SupplementalRole.isViewer(session["roles"] as Collection<String>)
        } else {
            false
        }
    }


    User getUser() {
        if (session["user"]) {
            (User) session["user"]
        } else {
            null
        }
    }

}