INSERT INTO versioned_key_person (
    versioned_issue_id,
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
    viep.versioned_issue_id,
    viep.project_key,
    'Legacy',
    viep.value,
    COALESCE(viep.sequence_number, 0),
	'migration',
    NOW(),
    0,
    0
FROM versioned_issue_extra_property viep
WHERE viep.name = 'collaborator'
AND viep.deleted = 0;