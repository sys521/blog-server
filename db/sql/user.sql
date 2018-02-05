CREATE TABLE user(
  u_id int primary key,
  u_name varchar(100) UNIQUE KEY not null, 
  u_password varchar(100) not null,
  u_displayName varchar(50) not null,
  u_email varchar(50) not null,
  u_phone varchar(50) not null,
  u_header_url varchar(100),
  u_permission varchar(10),
  create_time date,
  update_time date
);