package org.broadinstitute.orsp

class StatusEventDTO {
    Issue issue
    Event event
    Long duration

    StatusEventDTO(Issue issue, Event event, Long duration) {
        this.issue = issue
        this.event = event
        this.duration = duration
    }

    StatusEventDTO(Event event, Long duration) {
        this.event = event
        this.duration = duration

    }

}
