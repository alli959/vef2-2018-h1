const express = require('express');
const { getAll } = require('./users-api');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
  const data = await getAll();

  res.status(200).json(data);
});

router.get('/:id', (req, res) => {
  res.send('hello');
});

router.get('/me', (req, res) => {
  res.send('hello');
});

router.patch('/me', (req, res) => {
  res.send('hello');
});

router.post('/me/profile', (req, res) => {
  res.send('hello');
});

router.get('/me/read', (req, res) => {

});

router.post('/me/read', (req, res) => {

});

router.delete('/me/read/:id', (req, res) => {
  const { id } = req.body;
});

module.exports = router;
