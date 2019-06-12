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
    Map<String, List<String>> extraProperties = new HashMap<String, List<String>>()


    void setId(Number id) {
        this.id = id
    }
}
