package org.broadinstitute.orsp

class Funding {

    String source
    String sourceKey
    String name
    String awardNumber
    String projectKey
    Date created
    Date updated

    static constraints = {
        source blank: true, nullable: true
        sourceKey blank: true, nullable: true
        name blank: true, nullable: true
        awardNumber blank: true, nullable: true
        projectKey nullable: false
        created nullable: false
        updated nullable: true
    }

    static belongsTo = [issue:Issue]

}
