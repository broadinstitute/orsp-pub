package org.broadinstitute.orsp

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import grails.converters.JSON
import groovy.util.logging.Slf4j

@Slf4j
class AuthController {

    AuthService authService

    def authUser() {
        String token = params.token
        GoogleIdToken.Payload payload = authService.validateGoogleToken(token)
        if (payload) {
            User user = authService.createUserSessionFromPayload(payload)
            render user as JSON
        } else {
            session.invalidate()
            log.error("Invalid User Login: " + params)
            render "Invalid login" as JSON
        }
    }

}
