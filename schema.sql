CREATE TABLE users(
    id serial PRIMARY KEY,
    username character  varying(255) UNIQUE REQUIRED,
    password character  varying(255) REQUIRED,
    name character  varying(255) NOT NULL REQUIRED,
    userPhoto character  varying(255)
);

CREATE TABLE groups(
    id serial PRIMARY KEY,
    groupName CHARACTER varying(255) UNIQUE
);

CREATE TABLE books(
    id serial PRIMARY KEY,
    title CHARACTER varying(255) NOT NULL UNIQUE,
    isbn13 CHARACTER varying(255), 
    author CHARACTER varying(255),
    description text,
    groupName CHARACTER varying(255) references groups(groupName)


);

CREATE TABLE readBooks(
id serial,
userId serial REFERENCES users(id) REQUIRED,
bookId serial REFERENCES books(id) REQUIRED,
grade Integer REQUIRED,
comments text
);




