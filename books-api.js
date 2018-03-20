const {
  saveBook,
  getBookByTitle,
  getBookByIsBn13,
  getCategory,
  fetchBooks,
  getBookById,
  search,
  updateBooks,
} = require('./books-db');

const validator = require('validator');
const xss = require('xss');


 function helper(object){
  if(object === undefined){
    return false;
  }
  return true;
}

//***********************/
//********TODO validator********** */
//********************* */
async function getBooks(offset){
  const data = await fetchBooks(offset);
  return data;
}

//***********************/
//********TODO validator********** */
//********************* */
async function searchBooks(string, offset){
  const data = await search(string, offset);
  return data;
}


//***********************/
//********TODO validator********** */
//********************* */
async function getBooksById(id){
  const data = await getBookById(id);
  return data;
}

//***********************/
//********TODO validator********** */
//********************* */


async function changeBook (id, data) {
  const book = await getBookById(id);
  
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
  } = book;


 
  if(helper(data.title)){
    book[0].title = data.title;
  }
  if(helper(data.isbn13)){
    book[0].isbn13 = data.isbn13;
  }
  if(helper(data.author)){
    book[0].author = data.author;
  }
  if(helper(data.description)){
    book[0].description = data.description;
  }
  if(helper(data.category)){
    book[0].category = data.category;
  }
  if(helper(data.isbn10)){
    book[0].isbn10 = data.isbn10;
  }
  if(helper(data.published)){
    book[0].published = data.published;
  }
  if(helper(data.pagecount)){
    book[0].pagecount = data.pagecount;
  }
  if(helper(data.language)){
    book[0].language = data.language;
  }
  
  const result = await updateBooks(id, book);
  
  
  return result;
}

/**
 * Validation of a new book
 *
 * @param {Object} book - Book object to add
 * @param {String} book.title - Book's title, must be unique
 * @param {String} book.isbn13 - isbn13 ID of the book, must be unique and on the right format
 * @param {String} book.category - Category in which the book is
 * @param {String} book.isbn10 - isbn10 ID of the book, must be on the right format
 * @param {Int}    book.pagecount - Number of pages in the book
 * @param {String} book.language - Two-character string of the book's language
 *
 * @returns {Promise} Promise representing a array of errors objects, empty if no errors
 */
async function validateBook({
  title,
  isbn13,
  category,
  isbn10,
  pagecount,
  language,
} = {}) {
  const errors = [];

  if (!validator.isLength(title, { min: 1 })) {
    errors.push({ error: 'Title cant\'t be empty' });
  } else {
    const bookExists = await getBookByTitle(title);
    if (bookExists.length > 0) {
      errors.push({ error: 'This title is already registered' });
    }
  }

  if (!validator.isISBN(isbn13, [13])) {
    errors.push({ error: 'ISBN13 must be on the right format' });
  } else {
    const bookExists = await getBookByIsBn13(isbn13);
    if (bookExists.length > 0) {
      errors.push({ error: 'This ISBN13 is already registered' });
    }
  }

  const categoryExists = await getCategory(category);
  if (!categoryExists.length) {
    errors.push({ error: 'Category does not exist' });
  }

  if (!validator.isISBN(isbn10, [10]) && isbn10.length > 0) {
    errors.push({ error: 'ISBN10 must be on the right format' });
  }

  if (!validator.isInt(pagecount, { min: 0, max: 2147483647 })) {
    errors.push({ error: 'Pagenumber must be a integer' });
  }

  if ((typeof language) !== 'string') {
    errors.push({ error: 'Language must be a string of the format \'XX\'' });
  } else if (language.length !== 2 && language.length > 0) {
    errors.push({ error: 'Language must be a string of the format \'XX\'' });
  }

  return errors;
}

/**
 * Add one book to the database
 *
 * @param {Object} book - Book object to add
 * @param {String} book.title - Book's title
 * @param {String} book.isbn13 - isbn13 ID of the book
 * @param {String} book.author - Author of the book
 * @param {String} book.description - Book's description
 * @param {String} book.category - Category in which the book is
 * @param {String} book.published - Where the book was published
 * @param {Int}    book.pagecount - Number of pages in the book
 * @param {String} book.language - Two-character string of the book's language
 */
async function addBook({
  title,
  isbn13,
  author,
  description,
  category,
  isbn10,
  published,
  pagecount,
  language,
} = {}) {
  const errors = await validateBook({
    title, isbn13, category, isbn10, pagecount, language,
  });

  if (errors.length > 0) {
    return ({ status: 400, data: errors });
  }

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

  const output = await saveBook(data);
  return ({ status: 200, output: output[0] });
}

module.exports = {
  addBook,
  getBooks,
  getBooksById,
  searchBooks,
  changeBook,
};
