package org.broadinstitute.orsp.jobs

import grails.core.GrailsApplication
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.BspWebService

@Slf4j
class BspCollectionJob {

    BspWebService bspWebService
    GrailsApplication grailsApplication

    static concurrent = false

    static triggers = {
        // milliseconds * seconds * minutes
        simple name: 'sync collections every 10 minutes', startDelay: 1000 * 15, repeatInterval: 1000 * 60 * 10
    }

    void execute() {
        if (collectionSyncEnabled()) {
            log.info("Synchronizing sample collections at ${new Date().getDateTimeString()}")
            bspWebService.syncSampleCollections()
        }
    }

    boolean collectionSyncEnabled() {
        return grailsApplication.config.bsp.sync
    }

}
