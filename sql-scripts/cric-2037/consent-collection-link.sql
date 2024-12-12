-- infosec versioning related changes

alter table consent_collection_link
add parent_id int default null after questionnaire_version,
add sequence_number int default 0 not null after parent_id,
add is_latest varchar(2) default "Y" not null after sequence_number,
add updated_by varchar(255) default null after creation_date;