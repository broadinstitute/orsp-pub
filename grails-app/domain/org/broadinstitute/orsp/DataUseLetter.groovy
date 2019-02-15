package org.broadinstitute.orsp

class DataUseLetter {
    Integer id
    String uid
    String consentGroupKey
    String projectKey
    Integer submitted
    String dulInfo
    Date creationDate
    Date submitDate

    static constraints = {
        uid nullable: false
        consentGroupKey nullable: false
        projectKey nullable: false
        submitted nullable: false
        dulInfo nullable: true
        creationDate nullable: false
        submitDate nullable: true
    }
}
