require('dotenv').config();
const express = require('express');
const books = require('./books-router');
const users = require('./users-router');
const { getLoginInfo, comparePasswords } = require('./users-db');
const { register } = require('./users-api');

const passport = require('passport');
const { Strategy } = require('passport-local');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const sessionSecret = 'kool';

const app = express();

app.use(cookieParser(sessionSecret));
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

async function strat(username, password, done) {
  const user = await getLoginInfo(username);

  if (user) {
    const result = await comparePasswords(password, user.password);
    if (result) {
      console.info(user);
      return done(null, user);
    }
  }
  return done(null, false);
}

passport.use(new Strategy(strat));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await users.findById(id);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

app.use(passport.initialize());
app.use(passport.session());

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

app.post(
  '/login',
  passport.authenticate('local', {
    failureMessage: 'Vitlaust notendanafn eða lykilorð',
    failureRedirect: '/login',
  }),
  (req, res) => { // eslint-disable-line
    return res.status(200).json({ message: 'Login successful' });
  },
);

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

const {
  PORT: port = 3000,
  HOST: host = '127.0.0.1',
} = process.env;

app.listen(port, () => {
  console.info(`Server running at http://${host}:${port}/`);
});
