CREATE TABLE key_person (
    key_person_id INT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    project_key VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    other_role TEXT,
    sequence_number INT DEFAULT 0,
    update_user VARCHAR(150),
    update_date DATETIME,
    deleted INT DEFAULT 0,
    version BIGINT DEFAULT 0,
    CONSTRAINT fk_issue_key_person_issueversioned_issue
        FOREIGN KEY (issue_id)
        REFERENCES issue(id)
);