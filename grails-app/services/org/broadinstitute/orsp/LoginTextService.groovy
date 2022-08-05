package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

import java.sql.SQLException

@Slf4j
class LoginTextService {

    QueryService queryService
    PersistenceService persistenceService

    /**
     * Get login page text
     *
     * @return Heading and body of login text
     */
    @Transactional(readOnly = true)
    Collection<LoginText> getLoginText() {
        queryService.getLoginText()
    }

    void UpdateLoginText(String heading, String body) throws SQLException {
        LoginText loginText = LoginText.findById(1)
        if (loginText.heading != null) {
            loginText.setHeading(heading)
            persistenceService.saveLoginText(loginText)
        } else if (loginText.body != null) {
            loginText.setBody(body)
            persistenceService.saveLoginText(loginText)
        } else {
            log.error("Error while trying to update login text")
        }
    }

}
