INSERT INTO versioned_pm_study_staff (
    versioned_issue_id,
    project_key,
    pm,
    pm_type,
    sequence_number,
    update_user,
    update_date
)
SELECT
    v.versioned_issue_id,
    v.project_key,
    v.value AS pm,
    CASE
        WHEN ROW_NUMBER() OVER (
            PARTITION BY v.versioned_issue_id
            ORDER BY v.id ASC
        ) = 1 THEN 'PRIMARY'
        ELSE 'SECONDARY'
    END AS pm_type,
    v.sequence_number,
    'migration_script',
    CURRENT_TIMESTAMP
FROM versioned_issue_extra_property v
WHERE v.name = 'pm'
  AND v.deleted = 0;