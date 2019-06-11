package org.broadinstitute.orsp

class IssueSearchItemDTO {

    Integer id
    String projectKey
    String type
    String status
    String title
    String reporter
    Date expirationDate
    Date updateDate
    Map<String, String> extraProperties = new HashMap<String, String>()


    void setId(Number id) {
        this.id = id
    }
}
