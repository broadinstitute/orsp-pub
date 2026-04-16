CREATE TABLE versioned_pm_study_staff (
  versioned_pm_study_staff_id BIGINT NOT NULL AUTO_INCREMENT,
  versioned_issue_id BIGINT NOT NULL,
  project_key VARCHAR(255) NOT NULL,
  pm VARCHAR(50) NOT NULL,
  pm_type ENUM('PRIMARY','SECONDARY') NOT NULL,
  sequence_number INT NOT NULL,
  update_user VARCHAR(50) NOT NULL,
  update_date DATETIME NOT NULL,
  PRIMARY KEY (versioned_pm_study_staff_id),
  CONSTRAINT fk_versioned_pm_study_staff_issue
    FOREIGN KEY (versioned_issue_id)
    REFERENCES versioned_issue(id)
    ON DELETE CASCADE
);
 