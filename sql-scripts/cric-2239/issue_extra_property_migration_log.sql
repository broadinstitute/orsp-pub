CREATE TABLE issue_extra_property_migration_log (
    issue_extra_property_migration_log_id BIGINT NOT NULL AUTO_INCREMENT,
    version BIGINT NOT NULL,
    issue_id BIGINT NOT NULL,
    project_key VARCHAR(255) NOT NULL,
    migration_type ENUM('PI', 'PM', 'COLLABORATOR') NOT NULL,
    updated_at DATETIME NOT NULL,

    PRIMARY KEY (issue_extra_property_migration_log_id),

    CONSTRAINT fk_issue_extra_property_migration_issue
        FOREIGN KEY (issue_id)
        REFERENCES issue(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_issue_extra_property_migration
        UNIQUE (issue_id, migration_type)
);
