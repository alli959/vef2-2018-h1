const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { findUserById, findByUsername, comparePasswords } = require('./users-db');

const {
  JWT_SECRET: jwtSecret,
} = process.env;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function strat(data, next) {
  const user = await findUserById(data.id);

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

passport.use(new Strategy(jwtOptions, strat));

function requireAuthentication(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => { //eslint-disable-line
      if (err) {
        return next(err);
      }

      if (!user) {
        if (info) {
          const error = info.name === 'TokenExpiredError' ? 'expired token' : 'invalid token';
          return res.status(401).json({ error });
        }
        return res.status(401).json({ error: 'Missing user data ' });
      }

      req.user = user;
      next();
    },
  )(req, res, next);
}

async function login(username, password) {
  const user = await findByUsername(username);

  if (!user) {
    return { status: 401, data: { error: 'No such user' } };
  }
  const passwordIsCorrect = await comparePasswords(password, user.password);

  const { TOKEN_LIFETIME = 500000 } = process.env;

  if (passwordIsCorrect) {
    const payload = { id: user.id };
    const tokenOptions = { expiresIn: TOKEN_LIFETIME };
    const { expiresIn } = tokenOptions;
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
    return { status: 200, data: { token, expiresIn } };
  }
  return { status: 401, data: { error: 'Invalid password' } };
}

module.exports = {
  requireAuthentication,
  passport,
  login,
};
