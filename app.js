require('dotenv').config();
const express = require('express');
const books = require('./books-router');
const users = require('./users-router');
const { register } = require('./users-api');

const { passport, login } = require('./authentication');

const {
  PORT: port = 3000,
  HOST: host = '127.0.0.1',
} = process.env;

const app = express();

app.use(passport.initialize());

app.use(express.json());
app.use('/books', books);
app.use('/users', users);

app.post('/register', async (req, res) => {
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

app.get('/login', (req, res) => res.status(200).json('This is /login'));

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const { status, data } = await login(username, password);

  return res.status(status).json(data);
});

app.get('/categories', (req, res) => {

});

app.post('/categories', (req, res) => {

});

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running at http://${host}:${port}/`);
});
