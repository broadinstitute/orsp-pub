package org.broadinstitute.orsp

import org.joda.time.Period

class StatusEventDTO {
    Issue issue
    Event event
    Period duration

    StatusEventDTO(Issue issue, Event event, Period duration) {
        this.issue = issue
        this.event = event
        this.duration = duration
    }

    StatusEventDTO(Event event, Period duration) {
        this.event = event
        this.duration = duration

    }

}