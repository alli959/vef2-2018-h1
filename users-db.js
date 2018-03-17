const bcrypt = require('bcrypt');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

/*

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

*/

async function getAllUsers() {
  const client = new Client({ connectionString });

  await client.connect();
  const query = 'SELECT * FROM users';

  try {
    const result = await client.query(query);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error getting data');
    throw err;
  } finally {
    await client.end();
  }
}


async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);

  return result;
}

async function findByUsername(username) {
  const client = new Client({ connectionString });
  await client.connect();

  const query = 'SELECT * FROM users WHERE username = $1';

  try {
    const result = await client.query(query, [username]);

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function findById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function createUser(data) {
  const client = new Client({ connectionString });
  await client.connect();
  const query =
    'INSERT INTO users (username, name, password, photo) VALUES ($1, $2, $3, $4) RETURNING username, name, photo';

  try {
    const {
      username,
      name,
      password,
      photo,
    } = data;

    const hashedPassword = await bcrypt.hash(password, 11);
    const result = await client.query(query, [username, name, hashedPassword, photo]);

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = {
  getAllUsers,
  comparePasswords,
  findByUsername,
  findById,
  createUser,
};

