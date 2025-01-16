package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete

class VersionedIssueExtraProperty implements LogicalDelete<VersionedIssueExtraProperty> {

    String name
    String value
    String projectKey
    Integer sequenceNumber

    VersionedIssue versionedIssue

    static mapping = {
        versionedIssue column: 'versioned_issue_id'
    }

    static belongsTo = [versionedIssue: VersionedIssue]

    static constraints = {
    }
}
