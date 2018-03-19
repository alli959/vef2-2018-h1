const express = require('express');
const {
  addBook,
  getBooks,
  getBooksById,
} = require('./books-api');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
  const { offset } = req.query;
  const data = await getBooks(offset);
  return res.json(data);
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

router.patch('/:id', (req, res) => {
  const { id } = req.params;
});


module.exports = router;
