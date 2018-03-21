require('dotenv').config();
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function getCategory(category) {
  const client = new Client({ connectionString });
  const query = 'SELECT * FROM groups WHERE category = $1';
  await client.connect();

  try {
    const data = await client.query(query, [category]);
    const { rows } = data;
    return rows;
  } catch (err) {
    console.info(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function addNewCategory(category) {
  const client = new Client({ connectionString });
  const query = 'INSERT INTO groups(category) VALUES ($1) RETURNING *';
  await client.connect();

  try {
    const data = await client.query(query, [category]);
    const { rows } = data;
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function getAllCategories() {
  const client = new Client({ connectionString });
  const query = 'SELECT category FROM groups';
  await client.connect();

  try {
    const data = await client.query(query);
    const { rows } = data;
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function addCategory(category) {
  const client = new Client({ connectionString });
  const query = 'INSERT INTO groups (category) VALUES ($1) RETURNING *';
  await client.connect();

  try {
    const data = await client.query(query, [category]);
    const { rows } = data;
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function saveBook(data) {
  const client = new Client({ connectionString });
  const {
    title,
    isbn13,
    author,
    description,
    category,
    isbn10,
    published,
    pagecount,
    language,
  } = data;

  await client.connect();

  const query =
    'INSERT INTO books(title, isbn13, author, description, category, isbn10, published, pagecount, language) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *';

  const values = [
    title, isbn13, author, description, category,
    isbn10, published, pagecount, language,
  ];

  try {
    const result = await client.query(query, values);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error inserting data');
    throw err;
  } finally {
    await client.end();
  }
}

async function search(string, offset, limit = 10) {
  const client = new Client({ connectionString });
  const query = 'SELECT * FROM books WHERE (to_tsvector(title) @@ to_tsquery($1)) OR (to_tsvector(description) @@ to_tsquery($1)) offset ($2) limit $3';
  await client.connect();
  try {
    const data = await client.query(query, [string, offset, limit]);
    const { rows } = data;
    return rows;
  } catch (err) {
    console.info(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function updateBooks(id, data) {
  const client = new Client({ connectionString });

  const {
    title,
    isbn13,
    author,
    description,
    category,
    isbn10,
    published,
    pagecount,
    language,
  } = data;


  await client.connect();
  const query = 'UPDATE books SET (title,isbn13,author,description,category,isbn10,published,pagecount,language) = ($2, $3, $4, $5, $6, $7, $8, $9, $10) WHERE id = $1';

  const values = [
    id, title, isbn13, author, description, category,
    isbn10, published, pagecount, language,
  ];
  try {
    const result = await client.query(query, values);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.info(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function getBookByTitle(title) {
  const client = new Client({ connectionString });
  const query = 'SELECT * FROM books WHERE title = $1';
  await client.connect();

  try {
    const data = await client.query(query, [title]);
    const { rows } = data;
    return rows;
  } catch (err) {
    console.info(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function getBookByIsBn13(isbn13) {
  const client = new Client({ connectionString });
  const query = 'SELECT * FROM books WHERE isbn13 = $1';
  await client.connect();

  try {
    const data = await client.query(query, [isbn13]);
    const { rows } = data;
    return rows;
  } catch (err) {
    console.info(err);
    throw err;
  } finally {
    await client.end();
  }
}


async function getBookById(id) {
  const client = new Client({ connectionString });
  const query = 'SELECT * FROM books WHERE id = $1';
  await client.connect();

  try {
    const data = await client.query(query, [id]);
    const { rows } = data;
    return rows;
  } catch (err) {
    console.info(err);
    throw err;
  } finally {
    await client.end();
  }
}


async function fetchBooks(offset) {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query('SELECT * FROM books LIMIT 10 offset ($1)', [offset]);

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error selecting form data');
    throw err;
  } finally {
    await client.end();
  }
}

async function addBookReadBy(userid, bookid, grade, comments) {
  const client = new Client({ connectionString });
  const query = 'INSERT INTO readBooks (userid, bookid, grade, comments) VALUES ($1, $2, $3, $4) RETURNING *';
  await client.connect();

  try {
    const result = await client.query(query, [userid, bookid, grade, comments]);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function getBookReadBy(userid, bookid) {
  const client = new Client({ connectionString });
  const query = 'SELECT * FROM books WHERE id = (SELECT bookId FROM readBooks WHERE bookId = $1 AND userId = $2)';
  await client.connect();

  try {
    const result = await client.query(query, [bookid, userid]);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function getAllReadBy(id, offset = 0, limit = 10) {
  const client = new Client({ connectionString });
  const query = 'SELECT * FROM books WHERE id IN (SELECT bookId FROM readBooks WHERE userId = $1) LIMIT $2 OFFSET $3';
  await client.connect();

  try {
    const result = await client.query(query, [id, limit, offset]);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function deleteReadBy(readId, userId) {
  const client = new Client({ connectionString });
  const query = 'DELETE FROM readBooks WHERE bookId = $1 AND userId = $2 RETURNING *';
  await client.connect();

  try {
    const result = await client.query(query, [readId, userId]);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function runQuery(query) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query(query);

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = {
  saveBook,
  fetchBooks,
  runQuery,
  getBookByTitle,
  getBookByIsBn13,
  getCategory,
  getAllCategories,
  addCategory,
  getBookById,
  search,
  addBookReadBy,
  getBookReadBy,
  getAllReadBy,
  deleteReadBy,
  addNewCategory,
  updateBooks,
};
