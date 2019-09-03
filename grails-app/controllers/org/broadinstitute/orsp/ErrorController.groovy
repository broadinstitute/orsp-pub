package org.broadinstitute.orsp

import grails.converters.JSON

class ErrorController {

    // Forbidden
    def error403() {
        withFormat {
            html { render(view: '/denied') }
            json {
                render(status: 403, text: '', contentType: 'application/json')
            }
        }
    }

    // Not Found
    def error404() {
        withFormat {
            html {
                String missingPage = request.getAttribute('javax.servlet.error.message')
                log.info("404 when trying to access page ${missingPage}")
                render(view: '/notFound')
            }
            json {
                render(status: 404, text: '', contentType: 'application/json')
            }
        }
    }

    // Conflict
    def error409() {
        withFormat {
            html { render(view: '/conflict') }
            json {
                render(status: 409, text: '', contentType: 'application/json')
            }
        }
    }

    def error400() {
        def exception = request.exception
        withFormat {
            html { render(view: '/error') }
            json { render exception as JSON }
        }
    }


    def error500() {
        def exception = request.exception
        withFormat {
            html { render(view: '/error') }
            json { render exception as JSON }
        }
    }

}
