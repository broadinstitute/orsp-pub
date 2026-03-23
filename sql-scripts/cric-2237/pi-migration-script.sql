-- Migrating Primary Pi from  issue_extra_property to pi_study_staff

INSERT INTO orsp_dev.pi_study_staff (
    issue_id,
    project_key,
    pi,
    pi_type,
    sequence_number,
    update_user,
    update_date,
    version
)
SELECT
    t.issue_id,
    t.project_key,
    t.value AS pi,
    'PRIMARY' AS pi_type,
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
            ORDER BY id ASC
        ) AS rn
    FROM orsp_dev.issue_extra_property
    WHERE name = 'pi'
      AND deleted = 0
) t
WHERE t.rn = 1;


-- secondary pi from  issue extra property to Keyperson
-- this won't insert if table alredy duplicate row so run after secondary pm migration

INSERT INTO orsp_dev.key_person (
    issue_id,
    project_key,
    name,
    role,
    sequence_number,
    created_user,
    created_timestamp,
    update_user,
    update_date
)
SELECT
    t.issue_id,
    t.project_key,
    TRIM(t.value) AS name,
    'Legacy' AS role,
    t.sequence_number,
    'migration_script' AS created_user,
    NOW() AS created_timestamp,
    'migration_script' AS update_user,
    NOW() AS update_date
FROM (
    SELECT
        issue_id,
        project_key,
        value,
        sequence_number,
        ROW_NUMBER() OVER (
            PARTITION BY issue_id
            ORDER BY id ASC
        ) AS rn
    FROM orsp_dev.issue_extra_property
    WHERE name = 'pi'
      AND deleted = 0
      AND value IS NOT NULL
) t
WHERE t.rn > 1

AND NOT EXISTS (
    SELECT 1
    FROM orsp_dev.key_person kp
    WHERE kp.issue_id = t.issue_id
      AND kp.name = TRIM(t.value)
      AND kp.role = 'Legacy'
      AND kp.deleted = 0
);
