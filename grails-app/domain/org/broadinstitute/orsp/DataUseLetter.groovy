package org.broadinstitute.orsp


class DataUseLetter {
    Integer id
    String uid
    String creator
    String consentGroupKey
    Boolean submitted
    String dulInfo
    Date creationDate
    Date submitDate

    static constraints = {
        uid nullable: false
        creator nullable: false
        consentGroupKey nullable: false
        submitted nullable: true
        dulInfo nullable: true
        creationDate nullable: false
        submitDate nullable: true
    }
}
