const express = require('express');
const { register } = require('./users-api');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.post('/register', async (req, res) => {
  const {
    username,
    name,
    password,
    photo = '',
  } = req.body;

  const { status, data } = await register({
    username, name, password, photo,
  });

  return res.status(status).json(data);
});

router.post('/login', (req, res) => {
  res.send('heyo');
});

router.get('/categories', (req, res) => {

});

module.exports = router;
