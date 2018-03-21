const express = require('express');
const {
  addBook,
  getBooks,
  getBooksById,
  searchBooks,
  changeBook,
} = require('./books-api');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
  const { offset, search } = req.query;
  const searchData = await searchBooks(search, offset);
  const offsetData = await getBooks(offset);
  if (!search) {
    return res.json(offsetData);
  } // eslint-disable-line
  else if (searchData.length === null) {
    return res.status(404).json({error: 'not found'})
  }
  return res.json(searchData);
});


router.post('/', async (req, res) => {
  const {
    title,
    isbn13,
    author = '',
    description = '',
    category,
    isbn10 = '',
    published = '',
    pagecount = 0,
    language = '',
  } = req.body;

  const { status, data } = await addBook({
    title, isbn13, author, description, category, isbn10, published, pagecount, language,
  });

  return res.status(status).json(data);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const data = await getBooksById(id);
  return res.json(data);
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    title,
    isbn13,
    author = '',
    description = '',
    category,
    isbn10 = '',
    published = '',
    pagecount = 0,
    language = '',
  } = req.body;
  

  const {status, data } = await changeBook(id, req.body);
  return res.status(status).json(data);

});





module.exports = router;
