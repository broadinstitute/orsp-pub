package org.broadinstitute.orsp.api

import grails.converters.JSON
import org.broadinstitute.orsp.EventType
import org.broadinstitute.orsp.LoginText
import org.broadinstitute.orsp.LoginTextResponseService
import org.broadinstitute.orsp.LoginTextService
import org.broadinstitute.orsp.LogintTextResponse
import org.broadinstitute.orsp.PersistenceService
import org.broadinstitute.orsp.QueryService
import org.broadinstitute.orsp.utils.IssueUtils


class LoginTextController {

    LoginTextService loginTextService
    LoginTextResponseService loginTextResponseService
    PersistenceService persistenceService
    QueryService queryService

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
            LoginText loginTextUpdate = loginTextService.updateLoginText((String)loginText.get("heading"), (String)loginText.get("body"), (String)loginText.get("showMessage"))
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

    def updateDocumentDescriptionByUuid() {
        Map<String, Object> docEditDetails = IssueUtils.getJson(Map.class, request.JSON)
        String uuid = docEditDetails.get('uuid')
        String description = docEditDetails.get('description')
        String projectKey = docEditDetails.get('projectKey')
        String creator = docEditDetails.get('creator')
        try {
            if (queryService.updateDocumentDescriptionByUuid(uuid, description)) {
                persistenceService.saveEvent(projectKey, creator, "Document Description updated to"+description, EventType.DESCRIPTION_UPDATED)
            }
            response.status = 200
        } catch (Exception e) {
            handleException(e)
        }
    }

}
