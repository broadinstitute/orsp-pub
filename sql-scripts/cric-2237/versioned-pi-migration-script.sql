INSERT INTO versioned_pi_study_staff (
    versioned_issue_id,
    project_key,
    pi,
    pi_type,
    sequence_number,
    update_user,
    update_date
)
SELECT
    v.versioned_issue_id,
    v.project_key,
    v.value AS pi,
    CASE
        WHEN ROW_NUMBER() OVER (
            PARTITION BY v.versioned_issue_id
            ORDER BY v.id ASC
        ) = 1 THEN 'PRIMARY'
        ELSE 'SECONDARY'
    END AS pi_type,
    v.sequence_number,
    'migration_script',
    CURRENT_TIMESTAMP
FROM versioned_issue_extra_property v
WHERE v.name = 'pi'
  AND v.deleted = 0;