require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const { fetchBooks } = require('./database');

const router = express.Router();


const connectionString = process.env.DATABASE_URL || {
  user: 'postgres',
  host: 'localhost',
  database: 'h1',
  port: '5432',
};

async function query(q, values = []) {
  const client = new Client({ connectionString });
  await client.connect();

  let result;

  try {
    result = await client.query(q, values);
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }

  return result;
}


router.get('/', async (req, res) => {
  const {
    id,
    author,
    description,
    isbn10,
    isbn13,
    published,
    pagecount,
    language,
    category,
  } = req.body;
  const read = await fetchBooks();
  res.json(read);
});

module.exports = router;
