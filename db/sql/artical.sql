CREATE TABLE artical(
  a_id int primary key,
  abstract varchar(200),
  content_url varchar(200),
  author_id int,
  create_time datetime,
  update_time datetime,
  read_times int,
  FOREIGN KEY(author_id) references user(u_id)
);