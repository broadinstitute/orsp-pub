CREATE TABLE project_key_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(255),
    column_name VARCHAR(255),
    before_update VARCHAR(255),
    after_update VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logging changes for `checklist_answer`
INSERT INTO project_key_updates (table_name, column_name, before_update, after_update)
SELECT 'checklist_answer', 'project_key', ca.project_key, 
       CONCAT(CASE i.type
              WHEN 'NHSR Project' THEN 'NHSR'
              WHEN 'IRB Project' THEN 'IRB'
              WHEN 'Consent Group' THEN 'CG'
              WHEN "'Not Engaged' Project" THEN 'NE'
              WHEN 'Exempt Project' THEN 'EX'
              END, 
              SUBSTRING(ca.project_key, LENGTH('ORSP') + 1)) AS after_update
FROM checklist_answer ca
JOIN issue i ON ca.project_key = i.project_key
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project')
AND i.project_key LIKE "ORSP-%";


-- Logging changes for `comment`
INSERT INTO project_key_updates (table_name, column_name, before_update, after_update)
SELECT 'comment', 'project_key', ca.project_key,
       CONCAT(CASE i.type
              WHEN 'NHSR Project' THEN 'NHSR'
              WHEN 'IRB Project' THEN 'IRB'
              WHEN 'Consent Group' THEN 'CG'
              WHEN "'Not Engaged' Project" THEN 'NE'
              WHEN 'Exempt Project' THEN 'EX'
              END, 
              SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
FROM comment ca
JOIN issue i ON ca.project_key = i.project_key
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') 
AND i.project_key LIKE 'ORSP-%';

-- Logging changes for `consent_collection_link`
INSERT INTO project_key_updates (table_name, column_name, before_update, after_update)
SELECT 'consent_collection_link', 'project_key', ca.project_key,
       CONCAT(CASE i.type
              WHEN 'NHSR Project' THEN 'NHSR'
              WHEN 'IRB Project' THEN 'IRB'
              WHEN 'Consent Group' THEN 'CG'
              WHEN "'Not Engaged' Project" THEN 'NE'
              WHEN 'Exempt Project' THEN 'EX'
              END, 
              SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
FROM consent_collection_link ca
JOIN issue i ON ca.project_key = i.project_key
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') 
AND i.project_key LIKE 'ORSP-%';

-- Logging changes for `consent_collection_link` consent_key
INSERT INTO project_key_updates (table_name, column_name, before_update, after_update)
SELECT 'consent_collection_link', 'consent_key', ca.consent_key,
       CONCAT('CG', SUBSTRING(ca.consent_key, LENGTH('ORSP') + 1))
FROM consent_collection_link ca
JOIN issue i ON ca.project_key = i.project_key
WHERE ca.consent_key LIKE 'ORSP-%';

-- Logging changes for `event`
INSERT INTO project_key_updates (table_name, column_name, before_update, after_update)
SELECT 'event', 'project_key', ca.project_key,
       CONCAT(CASE i.type
              WHEN 'NHSR Project' THEN 'NHSR'
              WHEN 'IRB Project' THEN 'IRB'
              WHEN 'Consent Group' THEN 'CG'
              WHEN "'Not Engaged' Project" THEN 'NE'
              WHEN 'Exempt Project' THEN 'EX'
              END, 
              SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
FROM event ca
JOIN issue i ON ca.project_key = i.project_key
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') 
AND i.project_key LIKE 'ORSP-%';

-- Logging changes for `funding`
INSERT INTO project_key_updates (table_name, column_name, before_update, after_update)
SELECT 'funding', 'project_key', ca.project_key,
       CONCAT(CASE i.type
              WHEN 'NHSR Project' THEN 'NHSR'
              WHEN 'IRB Project' THEN 'IRB'
              WHEN 'Consent Group' THEN 'CG'
              WHEN "'Not Engaged' Project" THEN 'NE'
              WHEN 'Exempt Project' THEN 'EX'
              END, 
              SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
FROM funding ca
JOIN issue i ON ca.project_key = i.project_key
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') 
AND i.project_key LIKE 'ORSP-%';

-- Logging changes for `issue_extra_property`
INSERT INTO project_key_updates (table_name, column_name, before_update, after_update)
SELECT 'issue_extra_property', 'project_key', ca.project_key,
       CONCAT(CASE i.type
              WHEN 'NHSR Project' THEN 'NHSR'
              WHEN 'IRB Project' THEN 'IRB'
              WHEN 'Consent Group' THEN 'CG'
              WHEN "'Not Engaged' Project" THEN 'NE'
              WHEN 'Exempt Project' THEN 'EX'
              END, 
              SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
FROM issue_extra_property ca
JOIN issue i ON ca.project_key = i.project_key
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') 
AND i.project_key LIKE 'ORSP-%';

-- Logging changes for `issue_review`
INSERT INTO project_key_updates (table_name, column_name, before_update, after_update)
SELECT 'issue_review', 'project_key', ca.project_key,
       CONCAT(CASE i.type
              WHEN 'NHSR Project' THEN 'NHSR'
              WHEN 'IRB Project' THEN 'IRB'
              WHEN 'Consent Group' THEN 'CG'
              WHEN "'Not Engaged' Project" THEN 'NE'
              WHEN 'Exempt Project' THEN 'EX'
              END, 
              SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
FROM issue_review ca
JOIN issue i ON ca.project_key = i.project_key
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') 
AND i.project_key LIKE 'ORSP-%';

-- Logging changes for `storage_document`
INSERT INTO project_key_updates (table_name, column_name, before_update, after_update)
SELECT 'storage_document', 'project_key', ca.project_key,
       CONCAT(CASE i.type
              WHEN 'NHSR Project' THEN 'NHSR'
              WHEN 'IRB Project' THEN 'IRB'
              WHEN 'Consent Group' THEN 'CG'
              WHEN "'Not Engaged' Project" THEN 'NE'
              WHEN 'Exempt Project' THEN 'EX'
              END, 
              SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
FROM storage_document ca
JOIN issue i ON ca.project_key = i.project_key
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') 
AND i.project_key LIKE 'ORSP-%';

-- Logging changes for `submission`
INSERT INTO project_key_updates (table_name, column_name, before_update, after_update)
SELECT 'submission', 'project_key', ca.project_key,
       CONCAT(CASE i.type
              WHEN 'NHSR Project' THEN 'NHSR'
              WHEN 'IRB Project' THEN 'IRB'
              WHEN 'Consent Group' THEN 'CG'
              WHEN "'Not Engaged' Project" THEN 'NE'
              WHEN 'Exempt Project' THEN 'EX'
              END, 
              SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
FROM submission ca
JOIN issue i ON ca.project_key = i.project_key
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') 
AND i.project_key LIKE 'ORSP-%';

-- Logging changes for `issue` table itself
INSERT INTO project_key_updates (table_name, column_name, before_update, after_update)
SELECT 'issue', 'project_key', project_key,
       CONCAT(CASE type
              WHEN 'NHSR Project' THEN 'NHSR'
              WHEN 'IRB Project' THEN 'IRB'
              WHEN 'Consent Group' THEN 'CG'
              WHEN "'Not Engaged' Project" THEN 'NE'
              WHEN 'Exempt Project' THEN 'EX'
              END, 
              SUBSTRING(project_key, LENGTH('ORSP') + 1))
FROM issue
WHERE type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project')
AND project_key LIKE 'ORSP-%';
