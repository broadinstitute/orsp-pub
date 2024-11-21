use orsp_dev;

SET SQL_SAFE_UPDATES = 0;

SET foreign_key_checks = 0;

UPDATE checklist_answer ca
JOIN issue i ON ca.project_key = i.project_key
SET ca.project_key = CONCAT(CASE i.type
                            WHEN 'NHSR Project' THEN 'NHSR'
                            WHEN 'IRB Project' THEN 'IRB'
                            WHEN 'Consent Group' THEN 'CG'
                            WHEN "'Not Engaged' Project" THEN 'NE'
                            WHEN 'Exempt Project' THEN 'EX'
                            END, 
                            SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') and i.project_key like "ORSP-%";

UPDATE comment ca
JOIN issue i ON ca.project_key = i.project_key
SET ca.project_key = CONCAT(CASE i.type
                            WHEN 'NHSR Project' THEN 'NHSR'
                            WHEN 'IRB Project' THEN 'IRB'
                            WHEN 'Consent Group' THEN 'CG'
                            WHEN "'Not Engaged' Project" THEN 'NE'
                            WHEN 'Exempt Project' THEN 'EX'
                            END, 
                            SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') and i.project_key like "ORSP-%";

UPDATE consent_collection_link ca
JOIN issue i ON ca.project_key = i.project_key
SET ca.project_key = CONCAT(CASE i.type
                            WHEN 'NHSR Project' THEN 'NHSR'
                            WHEN 'IRB Project' THEN 'IRB'
                            WHEN 'Consent Group' THEN 'CG'
                            WHEN "'Not Engaged' Project" THEN 'NE'
                            WHEN 'Exempt Project' THEN 'EX'
                            END, 
                            SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') and i.project_key like "ORSP-%";

UPDATE consent_collection_link ca
JOIN issue i ON ca.project_key = i.project_key
SET ca.consent_key = CONCAT('CG', SUBSTRING(ca.consent_key, LENGTH('ORSP') + 1)) WHERE ca.consent_key like "ORSP-%";

UPDATE event ca
JOIN issue i ON ca.project_key = i.project_key
SET ca.project_key = CONCAT(CASE i.type
                            WHEN 'NHSR Project' THEN 'NHSR'
                            WHEN 'IRB Project' THEN 'IRB'
                            WHEN 'Consent Group' THEN 'CG'
                            WHEN "'Not Engaged' Project" THEN 'NE'
                            WHEN 'Exempt Project' THEN 'EX'
                            END, 
                            SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') and i.project_key like "ORSP-%";

UPDATE funding ca
JOIN issue i ON ca.project_key = i.project_key
SET ca.project_key = CONCAT(CASE i.type
                            WHEN 'NHSR Project' THEN 'NHSR'
                            WHEN 'IRB Project' THEN 'IRB'
                            WHEN 'Consent Group' THEN 'CG'
                            WHEN "'Not Engaged' Project" THEN 'NE'
                            WHEN 'Exempt Project' THEN 'EX'
                            END, 
                            SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') and i.project_key like "ORSP-%";

UPDATE issue_extra_property ca
JOIN issue i ON ca.project_key = i.project_key
SET ca.project_key = CONCAT(CASE i.type
                            WHEN 'NHSR Project' THEN 'NHSR'
                            WHEN 'IRB Project' THEN 'IRB'
                            WHEN 'Consent Group' THEN 'CG'
                            WHEN "'Not Engaged' Project" THEN 'NE'
                            WHEN 'Exempt Project' THEN 'EX'
                            END, 
                            SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') and i.project_key like "ORSP-%";

UPDATE issue_review ca
JOIN issue i ON ca.project_key = i.project_key
SET ca.project_key = CONCAT(CASE i.type
                            WHEN 'NHSR Project' THEN 'NHSR'
                            WHEN 'IRB Project' THEN 'IRB'
                            WHEN 'Consent Group' THEN 'CG'
                            WHEN "'Not Engaged' Project" THEN 'NE'
                            WHEN 'Exempt Project' THEN 'EX'
                            END, 
                            SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') and i.project_key like "ORSP-%";

UPDATE storage_document ca
JOIN issue i ON ca.project_key = i.project_key
SET ca.project_key = CONCAT(CASE i.type
                            WHEN 'NHSR Project' THEN 'NHSR'
                            WHEN 'IRB Project' THEN 'IRB'
                            WHEN 'Consent Group' THEN 'CG'
                            WHEN "'Not Engaged' Project" THEN 'NE'
                            WHEN 'Exempt Project' THEN 'EX'
                            END, 
                            SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') and i.project_key like "ORSP-%";

UPDATE submission ca
JOIN issue i ON ca.project_key = i.project_key
SET ca.project_key = CONCAT(CASE i.type
                            WHEN 'NHSR Project' THEN 'NHSR'
                            WHEN 'IRB Project' THEN 'IRB'
                            WHEN 'Consent Group' THEN 'CG'
                            WHEN "'Not Engaged' Project" THEN 'NE'
                            WHEN 'Exempt Project' THEN 'EX'
                            END, 
                            SUBSTRING(ca.project_key, LENGTH('ORSP') + 1))
WHERE i.type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project') and i.project_key like "ORSP-%";

UPDATE issue
SET project_key = CONCAT(CASE type
                            WHEN 'NHSR Project' THEN 'NHSR'
                            WHEN 'IRB Project' THEN 'IRB'
                            WHEN 'Consent Group' THEN 'CG'
                            WHEN "'Not Engaged' Project" THEN 'NE'
                            WHEN 'Exempt Project' THEN 'EX'
                            END, 
                            SUBSTRING(project_key, LENGTH('ORSP') + 1))
WHERE type IN ('NHSR Project', 'IRB Project', 'Consent Group', "'Not Engaged' Project", 'Exempt Project')
AND project_key LIKE 'ORSP-%';

SET SQL_SAFE_UPDATES = 1;

SET foreign_key_checks = 1;