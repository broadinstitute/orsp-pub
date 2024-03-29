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

    Collection<LoginText> updateLoginText(String heading, String body, String showMessage) {
        queryService.updateLoginText(heading, body, showMessage)
    }

//    void UpdateLoginText(String heading, String body) throws SQLException {
//        LoginText loginText = LoginText.findById(1)
//        if (loginText != null) {
//            loginText.setHeading(heading)
//            loginText.setBody(body)
//            persistenceService.saveLoginText(loginText)
//        } else {
//            log.error("Error while trying to update login text")
//        }
//    }

}
