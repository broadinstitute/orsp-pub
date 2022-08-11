package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional

class LoginTextResponseService {

    QueryService queryService

    /**
     * Get login text response
     *
     * @return response data from db
     */
    @Transactional(readOnly = true)
    Collection<LogintTextResponse> getLoginTextResponse() {
        queryService.getLoginTextResponse()
    }

}
