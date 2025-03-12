-- Date: 2025-01-16
alter table issue
add column sequence_number int default 0 not null after status;

--Date: 2025-02-25
alter table issue 
add column update_user varchar(30) default null after request_date;
