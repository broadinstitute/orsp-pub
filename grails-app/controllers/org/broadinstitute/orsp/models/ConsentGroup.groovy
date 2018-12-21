package org.broadinstitute.orsp.models

class ConsentGroup extends IssueDTO {

    String consent
    String protocol
    String groupName
    String collInst
    String collContact
    String source
    // String sampleCollections
    String consentGroupDescription
    Date startDate
    Date endDate
    Boolean ongoingProcess
    List<Object> institutionalSources
    Boolean subjectProtection
    List<Object> questions


}
