CREATE TABLE versioned_key_person (
    key_person_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    versioned_issue_id BIGINT NOT NULL,
    version BIGINT DEFAULT 0,
    project_key VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    other_role TEXT,
    sequence_number INT DEFAULT 0,
    update_user VARCHAR(150),
    update_date DATETIME,
    deleted INT DEFAULT 0,

    CONSTRAINT fk_versioned_key_person_issue
        FOREIGN KEY (versioned_issue_id)
        REFERENCES versioned_issue(id)
);