package org.broadinstitute.orsp

class IssueSearchItemDTO {

    Integer id
    String issueKey
    String type
    String status
    String title
    String reporter
    String collaborator
    String pm
    String pi
    Date expirationDate
    Date updated


    void setId(Number id) {
        this.id = id
    }
}
