package org.broadinstitute.orsp

class HistoryController extends AuthenticatedController {

    def index() {
        return list()
    }

    def list() {
        def Collection<Event> events = queryService.getEventsForProject(params.id)
        render (view: "/history/list", model: [events: events])
    }

}
