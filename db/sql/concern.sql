CREATE TABLE concern(
  concern_id int primary key,
  from_user_id int,
  to_user_id int,
  foreign key(from_user_id) references user(u_id),
  foreign key(to_user_id) references user(u_id)
)ENGINE = InnoDB CHARSET=utf8