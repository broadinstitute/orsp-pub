package org.broadinstitute.orsp

class Event {

    String projectKey
    String author
    String summary
    Date created
    EventType eventType

    static constraints = {
        projectKey nullable: false
        author nullable: false
        summary nullable: false
        created nullable: false
        eventType nullable: true
    }

}
