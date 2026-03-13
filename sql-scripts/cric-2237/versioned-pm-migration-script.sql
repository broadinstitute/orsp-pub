-- primary pms from versioned_issue_extra_property => versioned_pm_study_staff

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
    ranked_pm.versioned_issue_id,
    ranked_pm.project_key,
    ranked_pm.value,
    'PRIMARY',
    ranked_pm.sequence_number,
    'migration',
    NOW()
FROM (
    SELECT
        viep.id,
        viep.versioned_issue_id,
        viep.project_key,
        viep.value,
        COALESCE(viep.sequence_number,0) AS sequence_number,
        ROW_NUMBER() OVER (
            PARTITION BY viep.versioned_issue_id
            ORDER BY viep.id
        ) AS rn
    FROM versioned_issue_extra_property viep
    WHERE viep.name = 'pm'
    AND viep.deleted = 0
) ranked_pm
WHERE ranked_pm.rn = 1;




-- secondary pms from versioned_issue_extra_property => versioned_key_person

INSERT INTO versioned_key_person (
    versioned_issue_id,
    project_key,
    role,
    name,
    sequence_number,
    update_date,
    deleted,
    version
)
SELECT
    ranked_pm.versioned_issue_id,
    ranked_pm.project_key,
    'Legacy',
    ranked_pm.value,
    ranked_pm.sequence_number,
    NOW(),
    0,
    0
FROM (
    SELECT
        viep.id,
        viep.versioned_issue_id,
        viep.project_key,
        viep.value,
        COALESCE(viep.sequence_number,0) AS sequence_number,
        ROW_NUMBER() OVER (
            PARTITION BY viep.versioned_issue_id
            ORDER BY viep.id
        ) AS rn
    FROM versioned_issue_extra_property viep
    WHERE viep.name = 'pm'
    AND viep.deleted = 0
) ranked_pm
WHERE ranked_pm.rn > 1;