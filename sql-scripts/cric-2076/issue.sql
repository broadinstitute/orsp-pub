  alter table issue 
  add origin_description text default null after description,
  add action_description text default null after origin_description,
  add sharing_description text default null after action_description;

  -- Remove above added columns (revert change)

  alter table issue 
  drop column origin_description,
  drop column action_description,
  drop column sharing_description;
