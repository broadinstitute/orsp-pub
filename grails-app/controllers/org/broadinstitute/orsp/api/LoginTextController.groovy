package org.broadinstitute.orsp.api

import grails.converters.JSON
import org.broadinstitute.orsp.LoginText
import org.broadinstitute.orsp.LoginTextService
import org.broadinstitute.orsp.utils.IssueUtils

import java.sql.SQLException

class LoginTextController {

    LoginTextService loginTextService

    def getLoginText() {
        try {
            List<LoginText> loginText = loginTextService.getLoginText()
            render loginText as JSON
        } catch (Exception e) {
            handleException(e)
        }
    }

    def updateLoginText() {
        Map<String, Object> loginText = IssueUtils.getJson(Map.class, request.JSON)
        try {
            LoginTextService.updateLoginText((String)loginText.get("heading"), (String)loginText.get("body"))
            response.status = 200
            render([message: 'Login text was updated'] as JSON)
        } catch(Exception e) {
            handleException(e)
        }
    }

}
