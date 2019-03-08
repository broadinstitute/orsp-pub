package org.broadinstitute.orsp

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

@Transactional
@Slf4j
class AuthService implements UserInfo {

    UserService userService

    GoogleIdToken.Payload validateGoogleToken(String token) {
        if (token) {
            def transport = new NetHttpTransport()
            def factory = new JacksonFactory()
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, factory)
                    .setAudience(Collections.singletonList((String) grailsApplication.config.googleSignInClientId))
                    .build()
            GoogleIdToken idToken = verifier.verify(token)
            log.debug(idToken?.payload?.toPrettyString())
            idToken?.payload
        } else {
            null
        }
    }

    User createUserSessionFromPayload(GoogleIdToken.Payload payload) {
        String displayName = payload.get("name")
        String email = payload.getEmail()
        String userName = email?.substring(0, email?.indexOf("@"))
        User user = userService.findOrCreateAuthenticatedUser(userName, email, displayName)
        if (user) {
            List<String> roles = user?.roles*.role
            log.info("User login: " + email)
            session["user"] = user
            session["roles"] = roles
            session["isOrsp"] = SupplementalRole.isOrsp(roles)
            session["isComplianceOffice"] = SupplementalRole.isComplianceOffice(roles)
            session["isAdmin"] = SupplementalRole.isAdmin(roles)
            session["isReadOnlyAdmin"] = SupplementalRole.isReadOnlyAdmin(roles)
            session["isBroad"] = true
        } else {
            // We don't have a valid Broad user in this case. Construct a non-Broad
            // session so the user can be appropriately informed of options
            log.info("Non-Broad user login: " + email)
            user = new User(
                    userName: userName,
                    emailAddress: email,
                    displayName: displayName,
            )
            session["user"] = user
            session["roles"] = []
            session["isOrsp"] = false
            session["isComplianceOffice"] = false
            session["isAdmin"] = false
            session["isBroad"] = false
            session["isReadOnlyAdmin"] = false
        }
        user
    }
}
