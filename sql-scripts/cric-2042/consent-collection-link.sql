alter table consent_collection_link 
add mta_or_dta varchar(255) DEFAULT NULL after collaborator_approval,
add delivery_date datetime(6) DEFAULT NULL after mta_or_dta,
add release_date datetime(6) DEFAULT NULL after delivery_date,
add questionnaire_version varchar(5) DEFAULT "v1" after deleted;


-- infosec versioning related changes

alter table consent_collection_link
add parent_id int default null after questionnaire_version,
add sequence_number int default 0 not null after parent_id,
add is_latest varchar(2) default "Y" not null after sequence_number,
add updated_by varchar(255) default null after creation_date;
