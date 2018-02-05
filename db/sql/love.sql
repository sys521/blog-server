CREATE TABLE LOVE(
  l_id int primary key,
  user_id int,
  artical_id int,
  foreign key(user_id) references user(u_id),
  foreign key(artical_id) references artical(a_id)
)ENGINE = InnoDB CHARSET=utf8