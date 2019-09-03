package org.broadinstitute.orsp

import org.joda.time.Period

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
