package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete

class VersionedIssue implements LogicalDelete<VersionedIssue> {

    Integer id
    String projectKey
    Integer issueNum
    String type
    String status
    String summary
    String description
    String reporter
    String approvalStatus
    Date requestDate
    Date updateDate
    Date expirationDate
    Date createdAt
    String createdBy
    Integer sequenceNumber

    static hasMany = [versionedExtraProperties: VersionedIssueExtraProperty, versionedFunding: VersionedFunding]

    static mapping = {
        versionedExtraProperties fetch: 'join'
        versionedFunding fetch: 'join'
    }

    static constraints = {
        projectKey blank: false, nullable: false
        issueNum nullable: true
        type blank: false, nullable: false
        status blank: false, nullable: false
        summary blank: false, nullable: false
        description blank: true, nullable: true
        reporter blank: true, nullable: true
        requestDate nullable: false
        updateDate nullable: true
        expirationDate nullable: true
        approvalStatus blank: true, nullable: true
        createdAt nullable: false
        createdBy nullable: false
        sequenceNumber blank: false, nullable: false
    }
}
