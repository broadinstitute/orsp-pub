package org.broadinstitute.orsp

import groovy.util.logging.Slf4j

@Slf4j
class IssueSearchItemDTO {

    Integer id
    String projectKey
    String type
    String status
    String summary
    String reporter
    String reporterName
    String approvalStatus
    Date expirationDate
    Date updateDate

    Map<String, Set<String>> contactNames = new HashMap<String, Set<String>>()
    Map<String, Set<String>> extraProperties = new HashMap<String, Set<String>>()


    IssueSearchItemDTO(Map<String, String> result) {
        try {
            this.id = result.get("id") != null ? Integer.valueOf(result.get("id").toString()) : null
        } catch (NumberFormatException nfe) {
            log.error("Cast error " + nfe)
        }
        this.projectKey = result.get("projectKey").toString()
        this.type = result.get("type")?.toString()
        this.status = result.get("status")?.toString()
        this.summary = result.get("summary")?.toString()
        this.reporter = result.get("reporter")?.toString()
        this.reporterName = result.get("reporterName")?.toString()
        this.approvalStatus = result.get("approvalStatus")?.toString()
        this.expirationDate = result.get("expirationDate")
        this.updateDate = result.get("updated")

        if (result.get("type") != IssueType.CONSENT_GROUP.name) {
            this.setExtraProperty(result.get("name").toString(), result.get("value").toString())
            this.setAccessContacts(result.get("name").toString(), result.get("displayName"))
        }
    }

/**
 * Check if already exists extra properties for the specified name, get the values and
 * add to the existing ones. If not create an empty Set to add the extra prop value
 * @param name
 * @param value
 */
    void setExtraProperty(String name, String value) {
        Set<String> extraProp = this.extraProperties.get(name) != null ? this.extraProperties.get(name) : new ArrayList<String>()
        extraProp.add(value)
        this.extraProperties.put(name, extraProp)
    }

    void setAccessContacts(String name, String value) {
        Set<String> access  = this.contactNames.get(name) != null ? this.contactNames.get(name) :  new ArrayList<String>()
        access.add(value)
        this.contactNames.put(name, access)
    }

    Collection<String> getAccessContacts() {
        Collection<String> accessContacts = this.contactNames.findAll ({ it.key == IssueExtraProperty.PM }).values().flatten()
        accessContacts = accessContacts.isEmpty() ? Collections.singleton(this.reporterName) : accessContacts
        accessContacts.sort()
    }

    static Set<IssueSearchItemDTO> processResults(List<Object[]> results) {

        Set<IssueSearchItemDTO> resultDTO = new HashSet<IssueSearchItemDTO>()
        IssueSearchItemDTO issueSearchItemDTO
        String currentProjectKey = ""

        def rows = results.collect { resultRow ->
            [
                id            : resultRow[0],
                projectKey    : resultRow[1],
                type          : resultRow[2],
                status        : resultRow[3],
                summary       : resultRow[4],
                reporter      : resultRow[5],
                reporterName  : resultRow[6],
                approvalStatus: resultRow[7],
                updated       : resultRow[8],
                expirationDate: resultRow[9],
                name          : resultRow[10],
                value         : resultRow[11],
                displayName   : resultRow[12]
            ]
        }

        rows.each { 
            if (it.projectKey == currentProjectKey) {
                if (it.type != IssueType.CONSENT_GROUP.name) {
                    issueSearchItemDTO.setExtraProperty(it.name.toString(), it.value.toString())
                    issueSearchItemDTO.setAccessContacts(it.name.toString(), it.displayName.toString())
                }
            } else {
                if (currentProjectKey != "") {
                    resultDTO.add(issueSearchItemDTO)
                }
                currentProjectKey = it.projectKey
                issueSearchItemDTO = new IssueSearchItemDTO(it.toSorted())

                if (it.type != IssueType.CONSENT_GROUP.name) {
                    issueSearchItemDTO.setExtraProperty(it.name.toString(), it.value.toString())
                    issueSearchItemDTO.setAccessContacts(it.name.toString(), it.displayName.toString())
                }
            }
            resultDTO.add(issueSearchItemDTO)
        }
        resultDTO
    }

    String getApprovalStatus() { approvalStatus != IssueStatus.Legacy.name ? approvalStatus : status }
}
