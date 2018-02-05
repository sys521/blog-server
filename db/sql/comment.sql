CREATE TABLE COMMENT(
  c_id int primary key,
  artical_id int not null,
  user_id int not null,
  create_time date not null,
  update_time date not null,
  content varchar(500),
  foreign key(artical_id) references artical(a_id),
  foreign key(user_id) references user(u_id)
)ENGINE = InnoDB CHARSET=utf8