CREATE TABLE users(
    id serial PRIMARY KEY,
    username Varchar(255) UNIQUE,
    password Varchar(255),
    name Varchar(255) NOT NULL,
    Photo Varchar(255)
);

CREATE TABLE groups(
    id serial PRIMARY KEY,
    category Varchar(255) UNIQUE
);

CREATE TABLE books(
    id serial PRIMARY KEY,
    title Varchar(255) NOT NULL UNIQUE,
    author Varchar(255),
    description text,
    isbn10 Varchar(255),
    isbn13 Varchar(255),
    published Varchar(255),
    pagecount text,
    language Varchar(255),
    category Varchar(255) references groups(category)
);

CREATE TABLE readBooks(
    id serial,
    userId serial FOREIGN KEY REFERENCES users(id),
    bookId serial FOREIGN KEY REFERENCES books(id),
    grade Integer,
    comments text
);




