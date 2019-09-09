package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import javassist.NotFoundException
import org.apache.http.HttpResponse

import javax.servlet.http.HttpServletResponse

@Slf4j
trait ExceptionHandler {

    def handleException(Exception e, Integer statusCode) {
        log.error("${e}")
        response.status = statusCode
        render([message: e.message] as JSON)
    }

}