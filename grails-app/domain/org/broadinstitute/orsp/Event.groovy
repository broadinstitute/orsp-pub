package org.broadinstitute.orsp

/**
 *
 * Created: 10/21/14
 *
 * @author <a href="mailto:grushton@broadinstitute.org">grushton</a>
 */
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
