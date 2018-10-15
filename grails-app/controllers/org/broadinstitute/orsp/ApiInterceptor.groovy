package org.broadinstitute.orsp

import grails.converters.JSON

/**
 * Interceptor specific to API based services.
 *
 * Requires an active session to proceed.
 */
class ApiInterceptor implements UserInfo  {

    ApiInterceptor() {
        match controller: 'report', action: 'funding'
    }

    @Override
    boolean before() {
        if (!session.getAttribute("user")) {
            session.setAttribute("savedParams", params)
            forbidden()
            false
        }
        true
    }

    def forbidden() {
        response.status = 403
        render([error: 'access denied'] as JSON)
    }

    def exception(Exception e) {
        response.status = 500
        render([error: e.message] as JSON)
    }

}
