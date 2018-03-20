const express = require('express');
const { getAll, getOneById } = require('./users-api');
const { requireAuthentication } = require('./authentication');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
  const data = await getAll();

  res.status(200).json(data);
});

router.get('/me', requireAuthentication, (req, res) => {
  res.send('hello');
});

router.patch('/me', requireAuthentication, (req, res) => {
  res.send('hello');
});

router.post('/me/profile', requireAuthentication, (req, res) => {
  res.send('hello');
});

router.get('/me/read', requireAuthentication, (req, res) => {

});

router.post('/me/read', requireAuthentication, (req, res) => {

});

router.delete('/me/read/:id', requireAuthentication, (req, res) => {
  const { id } = req.body;
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, data } = await getOneById(id);

  res.status(status).json(data);
});

module.exports = router;
