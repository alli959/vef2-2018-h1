const bcrypt = require('bcrypt');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;


async function getAllUsers(offset = 0, limit = 10) {
  const client = new Client({ connectionString });

  await client.connect();
  const query = 'SELECT username, name, photo FROM users LIMIT $1 OFFSET $2';

  try {
    const result = await client.query(query, [limit, offset]);
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
  const query = 'SELECT * FROM users WHERE username = $1';
  await client.connect();

  try {
    const result = await client.query(query, [username]);
    const { rows } = result;
    return rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function findUserById(id) {
  const client = new Client({ connectionString });
  const query = 'SELECT * FROM users WHERE id = $1';
  await client.connect();

  try {
    const result = await client.query(query, [id]);
    const { rows } = result;
    return rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function createUser(data) {
  const client = new Client({ connectionString });
  const query =
  'INSERT INTO users (username, name, password, photo) VALUES ($1, $2, $3, $4) RETURNING username, name, photo';
  await client.connect();

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

async function updatePassword(id, newpass) {
  const client = new Client({ connectionString });
  const query = 'UPDATE users SET password = $1 WHERE id = $2 RETURNING *';
  await client.connect();

  try {
    const result = await client.query(query, [newpass, id]);
    const { rows } = result;
    return rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function updateName(id, newname) {
  const client = new Client({ connectionString });
  const query = 'UPDATE users SET name = $1 WHERE id = $2 RETURNING *';
  await client.connect();

  try {
    const result = await client.query(query, [newname, id]);
    const { rows } = result;
    return rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function updatePhoto(id, url) {
  const client = new Client({ connectionString });
  const query = 'UPDATE users SET photo = $1 WHERE id = $2 RETURNING *';
  await client.connect();

  try {
    const result = await client.query(query, [url, id]);
    const { rows } = result;
    return rows[0];
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
  findUserById,
  createUser,
  updateName,
  updatePassword,
  updatePhoto,
};
