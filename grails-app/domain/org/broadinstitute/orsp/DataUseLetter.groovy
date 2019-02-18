package org.broadinstitute.orsp

import com.sun.org.apache.xpath.internal.operations.Bool

class DataUseLetter {
    Integer id
    String uid
    String creator
    String consentGroupKey
    String projectKey
    Boolean submitted
    String dulInfo
    Date creationDate
    Date submitDate

    static constraints = {
        uid nullable: false
        creator nullable: false
        consentGroupKey nullable: false
        projectKey nullable: false
        submitted nullable: true
        dulInfo nullable: true
        creationDate nullable: false
        submitDate nullable: true
    }
}
