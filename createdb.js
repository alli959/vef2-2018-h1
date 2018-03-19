require('dotenv').config();

const fs = require('fs');
const util = require('util');
const { runQuery } = require('./miscellaneous-db');

const readFileAsync = util.promisify(fs.readFile);
const schemaFile = './schema.sql';

async function create() {
  const data = readFileAsync(schemaFile);

  await runQuery(data.toString('utf-8'));

  console.info('Schema created');
}

create().catch((err) => {
  console.error('Error creating schema', err);
});
