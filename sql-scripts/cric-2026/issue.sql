alter table issue
add column sequence_number int default 0 not null after status;
