package org.broadinstitute.orsp.api

import grails.converters.JSON
import groovy.util.logging.Slf4j


@Slf4j
trait ExceptionHandler {

    def handleException(Exception e, Integer statusCode) {
        log.error("${e}")
        response.status = statusCode
        render([message: e.message] as JSON)
    }

}
