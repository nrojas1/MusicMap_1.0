CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    type varchar,
    talent_type varchar,
    child_type varchar,
    name varchar,
    pt geometry,
    date date,
    t_0 time,
    t_1 time,
    pay_opt varchar,
    description varchar
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX evenements_pkey ON evenements(id int4_ops);



DELETE from posts;

ALTER SEQUENCE posts_id_seq RESTART;

drop table posts;
