package org.broadinstitute.orsp

class IssueExtraPropertyMigrationLog {

    Long version

    String projectKey
    String migrationType
    Date updatedAt

    Issue issue

    static mapping = {
        table 'issue_extra_property_migration_log'
        id column: 'issue_extra_property_migration_log_id'
        version column: 'version'
        issue column: 'issue_id'
        projectKey column: 'project_key'
        migrationType column: 'migration_type'
        updatedAt column: 'updated_at'
    }

    static constraints = {
        issue nullable: false
        projectKey nullable: false, maxSize: 255
        migrationType nullable: false, maxSize: 50
        updatedAt nullable: false
    }
}
