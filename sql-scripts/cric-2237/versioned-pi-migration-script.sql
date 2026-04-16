--versioned_issue_extra_property to  versioned_pi_study_staff

INSERT INTO orsp_dev.versioned_pi_study_staff (
    versioned_issue_id,
    project_key,
    pi,
    pi_type,
    sequence_number,
    update_user,
    update_date
)
SELECT
    t.versioned_issue_id,
    t.project_key,
    TRIM(t.value) AS pi,
    'PRIMARY' AS pi_type,
    t.sequence_number,
    'migration_script' AS update_user,
    NOW() AS update_date
FROM (
    SELECT
        versioned_issue_id,
        project_key,
        value,
        sequence_number,
        ROW_NUMBER() OVER (
            PARTITION BY versioned_issue_id
            ORDER BY id ASC
        ) AS rn
    FROM orsp_dev.versioned_issue_extra_property
    WHERE name = 'pi'
      AND deleted = 0
      AND value IS NOT NULL
) t
WHERE t.rn = 1

AND NOT EXISTS (
    SELECT 1
    FROM orsp_dev.versioned_pi_study_staff vp
    WHERE vp.versioned_issue_id = t.versioned_issue_id
      AND vp.pi = TRIM(t.value)
      AND vp.pi_type = 'PRIMARY'
);


--versioned_issue_extra_property to  versioned_key_person

INSERT INTO orsp_dev.versioned_key_person (
    versioned_issue_id,
    project_key,
    name,
    role,
    sequence_number,
    update_user,
    update_date,
    deleted
)
SELECT
    t.versioned_issue_id,
    t.project_key,
    TRIM(t.value) AS name,
    'Legacy' AS role,
    t.sequence_number,
    'migration_script' AS update_user,
    NOW() AS update_date,
    0 AS deleted
FROM (
    SELECT
        id,
        versioned_issue_id,
        project_key,
        value,
        sequence_number,
        ROW_NUMBER() OVER (
            PARTITION BY versioned_issue_id
            ORDER BY id ASC
        ) AS rn
    FROM orsp_dev.versioned_issue_extra_property
    WHERE name = 'pi'
      AND deleted = 0
      AND value IS NOT NULL
) t
WHERE t.rn > 1

AND NOT EXISTS (
    SELECT 1
    FROM orsp_dev.versioned_key_person kp
    WHERE kp.versioned_issue_id = t.versioned_issue_id
      AND kp.name = TRIM(t.value)
      AND kp.role = 'Legacy'
      AND kp.deleted = 0
);