package org.broadinstitute.orsp

import grails.converters.JSON
import org.broadinstitute.orsp.utils.UtilityClass

class HistoryController extends AuthenticatedController {

    def index() {
        return list()
    }

    def list() {
        UtilityClass.registerEventMarshaller()
        JSON.use(UtilityClass.HISTORY) {
            render queryService.getEventsForProject(params.id) as JSON
        }
    }

}
