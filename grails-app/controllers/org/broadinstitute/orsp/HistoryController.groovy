package org.broadinstitute.orsp

import grails.converters.JSON

class HistoryController extends AuthenticatedController {

    def index() {
        return list()
    }

    def list() {
        Collection<Event> events = queryService.getEventsForProject(params.id)
        render([history: events] as JSON)
    }

}
