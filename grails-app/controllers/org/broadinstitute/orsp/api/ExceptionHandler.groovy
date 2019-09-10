package org.broadinstitute.orsp.api

import grails.converters.JSON
import groovy.util.logging.Slf4j


@Slf4j
trait ExceptionHandler {

    def handleException(Exception e) {
        log.error("${e}")
        response.status = 500
        render([error: e.message] as JSON)
    }

    def handleNotFound(String message) {
        log.error(message)
        response.status = 404
        render([error: message] as JSON)
    }

    def handleBadRequest(Exception e) {
        log.error("${e}")
        response.status = 400
        render([error: e.message] as JSON)
    }

}
