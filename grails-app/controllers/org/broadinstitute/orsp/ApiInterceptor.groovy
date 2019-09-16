package org.broadinstitute.orsp

import grails.converters.JSON

/**
 * Interceptor specific to API based services.
 *
 * Requires an active session to proceed.
 */
class ApiInterceptor implements UserInfo  {

    ApiInterceptor() {
        match controller: 'clarification'
        match controller: 'dulNotify'
        match controller: 'fileHelper'
        match controller: 'infoLink'
        match controller: 'issueReview'
        match controller: 'project'
        match controller: 'report'
        match controller: 'sampleConsentLink'
        match controller: 'consentGroup'
        match controller: 'dataUse'
        match controller: 'issueList'
        match controller: 'history'
        match controller: 'irb'
        match controller: 'ne'
        match controller: 'nhsr'
        match controller: 'search'
        match controller: 'submission'
        match controller: 'user'
    }

    @Override
    boolean before() {
        if (!session.getAttribute("user")) {
            session.setAttribute("savedParams", params)
            render(view: "/mainContainer/index")
            false
        }
        true
    }

    def exception(Exception e) {
        response.status = 500
        render([error: e.message] as JSON)
    }

}
