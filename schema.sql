CREATE TABLE users(
    id serial PRIMARY KEY,
    username Varchar(255) UNIQUE,
    password Varchar(255),
    name Varchar(255) NOT NULL,
    Photo Varchar(255)
);

CREATE TABLE groups(
    id serial PRIMARY KEY,
    category Varchar(255) NOT NULL UNIQUE
);

CREATE TABLE books(
    id serial PRIMARY KEY,
    title Varchar(255) NOT NULL UNIQUE,
    isbn13 Varchar(255),
    author Varchar(255),
    description text,
    category Varchar(255) REFERENCES groups(category),
    isbn10 Varchar(255),
    published Varchar(255),
    pagecount Integer,
    language Varchar(2)
);

CREATE TABLE readBooks(
    id serial,
    userId serial REFERENCES users(id),
    bookId serial REFERENCES books(id),
    grade Integer,
    comments text
);
