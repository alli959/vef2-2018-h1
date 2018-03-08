const bcrypt = require('bcrypt');
const { Client } = require('pg');

const csvFilePath = 'data/books.csv'
const csv = require('csvtojson')
 

const connectionString = process.env.DATABASE_URL;

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




csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
  console.log(jsonObj.title);
})
.on('done',(error)=>{
    console.log('end')
})







 



