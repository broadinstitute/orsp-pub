-- Migrating primary PMs to pm study staff from issue_extra_property

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
    'PRIMARY' AS pm_type,
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
) t
WHERE t.rn = 1;



-- Migrating secondary pms to Keyperson from issue_extra_property

INSERT INTO orsp_dev.key_person (
    issue_id,
    project_key,
    role,
    name,
    sequence_number,
    update_user,
    update_date,
    deleted,
    version
)
SELECT
    t.issue_id,
    t.project_key,
    'Legacy' AS role,
    t.value AS name,
    t.sequence_number,
    'migration_script' AS update_user,
    NOW() AS update_date,
    0 AS deleted,
    0 AS version
FROM (
    SELECT
        id,
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
) t
WHERE t.rn > 1;