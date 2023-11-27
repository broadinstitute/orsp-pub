package org.broadinstitute.orsp

import grails.converters.JSON
import groovy.util.logging.Slf4j

@Slf4j
class SchedulerController {

    SchedulerService schedulerService

    def generateWeeklyReport() {
        schedulerService.getWeeklyReportData()
        response.status = 200
    }

}
