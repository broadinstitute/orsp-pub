package org.broadinstitute.orsp

import groovy.sql.GroovyRowResult
import groovy.util.logging.Slf4j

@Slf4j
class IssueSearchItemDTO {
    Integer id
    String projectKey
    String type
    String status
    String summary
    String reporter
    Date expirationDate
    Date updateDate
    Map<String, Set<String>> extraProperties = new HashMap<String, Set<String>>()

    IssueSearchItemDTO(GroovyRowResult result) {
        try {
            this.id = Integer.valueOf(result.get("id").toString())
        } catch (NumberFormatException nfe) {
            log.error("Cast error " + nfe)
        }
        this.projectKey = result.get("projectKey").toString()
        this.type = result.get("type").toString()
        this.status = result.get("status").toString()
        this.summary = result.get("summary").toString()
        this.reporter = result.get("reporter").toString()
        this.expirationDate = result.get("expirationDate")
        this.updateDate = result.get("updated")
    }
}
