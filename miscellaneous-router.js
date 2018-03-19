const express = require('express');
const { register, login } = require('./users-api');

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

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = { username, password };
  const { status, data } = await login(user);

  return res.status(status).json(data);
});

router.get('/categories', (req, res) => {

});

router.post('/categories', (req, res) => {

});

module.exports = router;
