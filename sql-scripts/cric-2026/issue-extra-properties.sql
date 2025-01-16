alter table issue_extra_property
add column sequence_number int default 0 not null after project_key;
