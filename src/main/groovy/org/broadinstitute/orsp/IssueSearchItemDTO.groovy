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
    Set<ExtraPropsSearchItemDTO> extraProperties = new HashSet<ExtraPropsSearchItemDTO>()

    Map<String, List<String>> getExtraPropertiesMap() {
        Map<String, List<ExtraPropsSearchItemDTO>> propsByName = getExtraProperties().groupBy { it -> it.name }
        if (propsByName.containsKey(IssueExtraProperty.COLLABORATOR)) {
            List<IssueExtraProperty> props = propsByName.get(IssueExtraProperty.COLLABORATOR)
            propsByName.put("collaborators", props)
            propsByName.remove(IssueExtraProperty.COLLABORATOR)
        }
        propsByName.collectEntries { key, list ->
            [key, list*.value]
        }
    }
}
