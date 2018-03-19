const express = require('express');
const { addBook } = require('./books-api');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {

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

router.get('/:id', (req, res) => {
  const { id } = req.params;
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
});


module.exports = router;
