package org.broadinstitute.orsp

class IssueSearchItemDTO {

    Integer id
    String projectKey
    String type
    String status
    String title
    String reporter
    String projectManager
    Date expiration
    Date updated

    void setId(Number id) {
        this.id = id
    }
}
