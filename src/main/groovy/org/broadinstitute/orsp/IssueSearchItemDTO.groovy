package org.broadinstitute.orsp

class IssueSearchItemDTO {
    Integer id
    String projectKey
    String type
    String status
    String summary
    String reporter
    Date expirationDate
    Date updateDate
    Map<String, List<String>> extraProperties = new HashMap<String, List<String>>()
//    Set<ExtraPropsSearchItemDTO> extraProperties = new HashSet<ExtraPropsSearchItemDTO>()
}
