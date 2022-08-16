package org.broadinstitute.orsp.api

import grails.converters.JSON
import org.broadinstitute.orsp.LoginText
import org.broadinstitute.orsp.LoginTextResponseService
import org.broadinstitute.orsp.LoginTextService
import org.broadinstitute.orsp.LogintTextResponse
import org.broadinstitute.orsp.utils.IssueUtils


class LoginTextController {

    LoginTextService loginTextService
    LoginTextResponseService loginTextResponseService

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
            LoginText loginTextUpdate = loginTextService.updateLoginText((String)loginText.get("heading"), (String)loginText.get("body"))
            response.status = 200
        } catch(Exception e) {
            handleException(e)
        }
    }

    def getLoginTextResponse() {
        try {
            List<LogintTextResponse> loginTextResponse = loginTextResponseService.getLoginTextResponse()
            render loginTextResponse as JSON
        } catch(Exception e) {
            handleException(e)
        }
    }

}
