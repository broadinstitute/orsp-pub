package org.broadinstitute.orsp

import java.sql.Timestamp

/**
 * This class holds all of the generic query arguments that are used for searching across issues
 */
class QueryOptions {

    enum SortOrder {
        asc, desc
    }

    Collection<String> issueTypeNames = new ArrayList<String>()
    Collection<String> issueStatusNames = new ArrayList<String>()
    String sortField
    SortOrder sortOrder
    Integer max
    String projectKey
    String freeText
    String userName
    Collection<String> userNames = new ArrayList<String>()
    Collection<String> assignees = new ArrayList<String>()
    String fundingInstitute
    Collection<String> irbsOfRecord = new ArrayList<String>()
    String irbOfRecord
    Boolean ignoreAbandoned = true
    Boolean dataUseSearch
    String collection
    String consent
    String investigatorName
    Boolean generalUse
    Boolean tiered
    String dataUseInterpretation
    Boolean proprietaryData
    Boolean commercialUseExcluded
    String diseaseRestrictions
    String populationRestrictions
    String gender
    Boolean pediatric
    String beforeAfter
    Date dateRestriction
    Boolean methodsResearchExcluded
    Timestamp after
    Timestamp before

}
