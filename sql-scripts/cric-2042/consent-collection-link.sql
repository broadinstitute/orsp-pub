alter table consent_collection_link 
add mta_or_dta varchar(255) DEFAULT NULL after collaborator_approval,
add delivery_date datetime(6) DEFAULT NULL after mta_or_dta,
add release_date datetime(6) DEFAULT NULL after delivery_date,
add questionnaire_version varchar(5) DEFAULT "v1" after deleted;
