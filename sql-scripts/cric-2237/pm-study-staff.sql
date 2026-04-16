CREATE TABLE pm_study_staff (
    pm_study_staff_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    project_key VARCHAR(255) NOT NULL,
    pm VARCHAR(50),
    pm_type ENUM('PRIMARY', 'SECONDARY'),
    sequence_number INT,
    update_user VARCHAR(50),
    update_date DATETIME,
    version BIGINT,
    
    CONSTRAINT fk_pm_study_staff_issue_id
        FOREIGN KEY (issue_id)
        REFERENCES issue(id)
);
