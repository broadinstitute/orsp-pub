package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete

class DataLocations implements LogicalDelete<DataLocations> {
    String researchStage
    String dataStores
    String locationUrl
    String cloudProvider
    String terraUrl
    String gcsaUrl
    String gdriveUrl
    String onpremUrl
    String bilCluster
    String otherText

    static belongsTo = [consentCollectionLink: ConsentCollectionLink]

    static constraints = {
        researchStage(nullable: true, maxSize: 100)
        dataStores(nullable: true, maxSize: 2048)
        locationUrl(nullable: true, maxSize: 2048)
        cloudProvider(nullable: true, maxSize: 255)
        terraUrl(nullable: true)
        gcsaUrl(nullable: true)
        gdriveUrl(nullable: true)
        onpremUrl(nullable: true)
        bilCluster(nullable: true)
        otherText(nullable: true)
    }

    static mapping = {
        consentCollectionLink column: 'collection_link_id'
    }
}
