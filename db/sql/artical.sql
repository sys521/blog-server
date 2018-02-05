CREATE TABLE artical(
  a_id int primary key,
  abstract varchar(200),
  content_url varchar(200),
  author_id int,
  create_time date,
  update_time date,
  read_times int
  FOREIGN KEY(author_id) references user(u_id)
)ENGINE = InnoDB CHARSET=utf8