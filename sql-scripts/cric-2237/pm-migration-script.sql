INSERT INTO orsp_dev.pm_study_staff (
    issue_id,
    project_key,
    pm,
    pm_type,
    sequence_number,
    update_user,
    update_date,
    version
)
SELECT
    t.issue_id,
    t.project_key,
    t.value AS pm,
    CASE 
        WHEN t.rn = 1 THEN 'PRIMARY'
        ELSE 'SECONDARY'
    END AS pm_type,
    t.sequence_number,
    'migration_script' AS update_user,
    NOW() AS update_date,
    0 AS version
FROM (
    SELECT
        issue_id,
        project_key,
        value,
        sequence_number,
        ROW_NUMBER() OVER (
            PARTITION BY issue_id
            ORDER BY sequence_number ASC, id ASC
        ) AS rn
    FROM orsp_dev.issue_extra_property
    WHERE name = 'pm'
      AND deleted = 0
) t;