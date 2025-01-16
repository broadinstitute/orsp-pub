package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete

class Funding  implements LogicalDelete<Funding> {

    String source
    String sourceKey
    String name
    String awardNumber
    String projectKey
    Date created
    Date updated
    Integer sequenceNumber

    static constraints = {
        source blank: true, nullable: true
        sourceKey blank: true, nullable: true
        name blank: true, nullable: true
        awardNumber blank: true, nullable: true
        projectKey nullable: false
        created nullable: false
        updated nullable: true
        sequenceNumber nullable: false
    }

    static belongsTo = [issue:Issue]

}
