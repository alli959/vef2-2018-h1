const {
  saveBook,
  getBookByTitle,
  getBookByIsBn13,
  getCategory,
  getAllCategories,
  fetchBooks,
  getBookById,
  addNewCategory,
  search,
  updateBooks,
} = require('./books-db');

const validator = require('validator');
const xss = require('xss');



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

  const newBook = book[0];
 
  if (data.title) {
    newBook.title = xss(data.title);

  }
  if (data.isbn13) {
    newBook.isbn13 = xss(data.isbn13);
  }
  if (data.author) {
    newBook.author = xss(data.author);
  }
  if (data.description) {
    newBook.description = xss(data.description);
  }
  if (data.category) {
    newBook.category = xss(data.category);
  }
  if (data.isbn10) {
    newBook.isbn10 = xss(data.isbn10);
  }
  if (data.published) {
    newBook.published = xss(data.published);
  }
  if (data.pagecount) {
    newBook.pagecount = xss(data.pagecount);
  }
  if (data.language) {
    newBook.language = xss(data.language);
  }


  const errors = await validateBook(newBook);
  
  console.log(errors);
  if (errors.length > 0) {
    return ({ status: 400, data: errors });
  }
  
  const result = await updateBooks(id, book);
  
  
  return ({ status: 200, output: result });
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
      console.log(bookExists);
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

  if (!validator.isInt(String(pagecount), { min: 0, max: 2147483647 })) {
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

/**
 * Get all categories
 *
 * @returns {Promise} Promise representing a list of categories
 */
async function getCategories() {
  const data = await getAllCategories();
  return { status: 200, data };
}

/**
 * Add a category
 *
 * @returns {Promise} Promise representing a list of categories
 */
async function addCategory(category) {
  if (category) {
    const categoryExists = await getCategory(category);
    console.info(categoryExists);
    if (categoryExists.length > 0) {
      return { status: 400, data: { error: 'Category already exists' } };
    }
    const data = await addNewCategory(category);
    return { status: 200, data };
  }
  return { status: 400, data: { error: 'Include a category to add' } };
}

module.exports = {
  addBook,
  getBooks,
  getBooksById,
  searchBooks,
  getCategories,
  addCategory,
  changeBook,
};
