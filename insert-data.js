const csv = require('csvtojson');
const xss = require('xss');

const {
  addCategory,
  asyncSaveBook,
} = require('./books-db');

const csvFilePath = './data/books.csv';
const existingCategories = [];

function insert() {
  csv()
    .fromFile(csvFilePath)
    .on('json', async (jsonObj) => {
      const {
        title,
        isbn13,
        author,
        description,
        isbn10,
        published,
        pagecount,
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
        pagecount: xss(pagecount),
        language: xss(language),
      };

      await asyncSaveBook(data);
      setTimeout(250);
    })
    .on('done', () => {
      console.info('Finished inserting data');
    });
}

// csv()
//   .fromFile(csvFilePath)
//   .on('json', async (jsonObj) => {
//     const { category } = jsonObj;

//     if (existingCategories.indexOf(category) < 0) {
//       existingCategories.push(category);
//       await addCategory(xss(category));
//     }
//   })
//   .on('done', () => {
//     insert();
//   });

insert();
