const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function saveToGroups(data) {
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'INSERT INTO groups(category) VALUES($1)';
  const values = [data];

  try {
    await client.query(query, values);
  } catch (err) {
    console.error('Error inserting data');
    throw err;
  } finally {
    await client.end();
  }
}

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
    `INSERT INTO books(
      title, isbn13, author, description, category, 
      isbn10, published, pagecount, language
    ) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`;

  console.info(query);
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

async function fetchBooks() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query('SELECT * FROM books');
    console.log(result);

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error selecting form data');
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
  saveToGroups,
  saveBook,
  fetchBooks,
  runQuery,
  getBookByTitle,
  getBookByIsBn13,
  getCategory,
};
