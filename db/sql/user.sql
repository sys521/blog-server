CREATE TABLE user(
  u_id int primary key auto_increment,
  u_name varchar(100) UNIQUE KEY not null, 
  u_password varchar(100) not null,
  u_displayName varchar(50),
  u_email varchar(100) not null,
  u_header_url varchar(100),
  u_permission varchar(10),
  create_time datetime,
  update_time datetime
);