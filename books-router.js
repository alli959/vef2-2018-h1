const express = require('express');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
  const {
    id,
    author,
    description,
    isbn10,
    isbn13,
    published,
    pagecount,
    language,
    category,
  } = req.body;
  const read = await fetchBooks();
  res.json(read);
});

router.post('/', (req, res) => {

});

router.get('/:id', (req, res) => {
  const { id } = req.params;
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
});


module.exports = router;
