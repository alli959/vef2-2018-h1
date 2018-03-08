const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL||{
    user: 'postgres',
    host: 'localhost',
    database: 'h1',
    port: '5432'
  };

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


async function saveToBooks(data) {
    const client = new Client({ connectionString });
  
    await client.connect();
  
    const query = 'INSERT INTO books(title,author,description,isbn10,isbn13,published,pagecount,language,category) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
    const values = [data.title, data.author, data.description, data.isbn10, data.isbn13, data.published, data.pagecount, data.language, data.category];
  
    try {
      await client.query(query, values);
    } catch (err) {
      console.error('Error inserting data');
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
    saveToBooks,
  fetchData,
  runQuery,
};