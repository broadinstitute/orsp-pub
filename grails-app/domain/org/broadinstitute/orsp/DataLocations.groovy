package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete

class DataLocations implements LogicalDelete<DataLocations> {
    String researchStage
    String dataStores
    String locationUrl
    String cloudProvider

    static belongsTo = [consentCollectionLink: ConsentCollectionLink]

    static constraints = {
        researchStage(nullable: true, maxSize: 100)
        dataStores(nullable: true, maxSize: 2048)
        locationUrl(nullable: true, maxSize: 2048)
        cloudProvider(nullable: true, maxSize: 255)
    }

    static mapping = {
        consentCollectionLink column: 'collection_link_id'
    }
}
