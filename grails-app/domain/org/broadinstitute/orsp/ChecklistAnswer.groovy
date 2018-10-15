package org.broadinstitute.orsp

/**
 * Not currently in use. We have some old data in the database so keeping this domain class.
 */
class ChecklistAnswer {

    String questionId
    String projectKey
    String value

    Date updateDate
    String reviewer

    static constraints = {
        questionId nullable: false
        projectKey nullable: false
        value nullable: true
        updateDate nullable: false
        reviewer nullable: false
    }

}
