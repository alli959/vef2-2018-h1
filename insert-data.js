const csv = require('csvtojson');
const xss = require('xss');

const {
  addCategory,
  saveBook,
} = require('./books-db');

const csvFilePath = './data/books.csv';
const existingCategories = [];
const bookdump = [];

async function insert() {
  for (let i = 0; i < bookdump.length; i += 1) {
    await saveBook(bookdump[i]); // eslint-disable-line
  }
  console.info('Finished inserting data');
}

function readJson() {
  csv()
    .fromFile(csvFilePath)
    .on('json', (jsonObj) => {
      const {
        title,
        isbn13,
        author,
        description,
        isbn10,
        published,
        pagecount = 0,
        language,
        category,
      } = jsonObj;

      const data = {
        title: xss(title),
        isbn13: xss(isbn13),
        author: xss(author),
        description: xss(description),
        category: xss(category),
        isbn10: xss(isbn10),
        published: xss(published),
        pagecount: Number(xss(pagecount)),
        language: xss(language),
      };

      bookdump.push(data);
    })
    .on('done', async () => {
      console.info('Finished reading data');
      await insert();
    });
}

csv()
  .fromFile(csvFilePath)
  .on('json', async (jsonObj) => {
    const { category } = jsonObj;

    if (existingCategories.indexOf(category) < 0) {
      existingCategories.push(category);
      await addCategory(xss(category));
      console.info('Finished createing categories');
    }
  })
  .on('done', () => {
    setTimeout(readJson, 2000);
  });
