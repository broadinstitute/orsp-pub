package org.broadinstitute.orsp

class SampleCollection {

    Integer id
    String collectionId
    String name
    String category
    String groupName
    String archived

    static constraints = {
        collectionId nullable: false
        name nullable: false
        category nullable: true
        groupName nullable: true
        archived nullable: true
    }

}
