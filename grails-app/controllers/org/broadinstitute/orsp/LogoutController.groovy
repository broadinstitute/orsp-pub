package org.broadinstitute.orsp

import groovy.util.logging.Slf4j

@Slf4j
class LogoutController {

    def required() {
        flash.message = "Login required"
        render(view: 'enter')
    }

    def enter() {
    }

    def logout() {
        log.info("User logout: " + session["user"])
        session["user"] = null
        session["roles"] = null
        session["isOrsp"] = null
        session["isComplianceOffice"] = null
        session["isAdmin"] = null
        session["isBroad"] = null
        session.invalidate()
        redirect(uri: "/index")
    }
}
