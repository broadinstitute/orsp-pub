package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete

class VersionedFunding implements LogicalDelete<VersionedFunding> {

    Integer id
    String source
    String sourceKey
    String name
    String awardNumber
    String projectKey
    Integer sequenceNumber

    VersionedIssue versionedIssue

    static mapping = {
        versionedIssue column: 'versioned_issue_id'
    }

    static belongsTo = [versionedIssue: VersionedIssue]

    static constraints = {
        source nullable: true, maxSize: 60
        sourceKey nullable: true, maxSize: 60
        name nullable: true, maxSize: 500
        awardNumber nullable: true, maxSize: 255
        projectKey nullable: false, maxSize: 60
        sequenceNumber nullable: false, min: 0
        versionedIssue nullable: true
    }
}
