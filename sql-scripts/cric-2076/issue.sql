  alter table issue 
  add origin_description text default null after description,
  add action_description text default null after origin_description,
  add sharing_description text default null after action_description;
