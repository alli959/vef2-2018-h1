CREATE TABLE users(
    id serial PRIMARY KEY,
    username character  varying(255) UNIQUE,
    password character  varying(255),
    name character  varying(255) NOT NULL,
    userPhoto character  varying(255)
);

CREATE TABLE groups(
    id serial PRIMARY KEY,
    category CHARACTER varying(255) UNIQUE
);

CREATE TABLE books(
    id serial PRIMARY KEY,
    title CHARACTER varying(255) NOT NULL UNIQUE,
    author CHARACTER varying(255),
    description text,
    isbn10 CHARACTER varying(255),
    isbn13 CHARACTER varying(255), 
    published CHARACTER varying(255),
    pagecount text,
    language character varying(255),
    category CHARACTER varying(255) references groups(category)

);

CREATE TABLE readBooks(
    id serial,
    userId serial REFERENCES users(id),
    bookId serial REFERENCES books(id),
    grade Integer,
    comments text
);




