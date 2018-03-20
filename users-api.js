const {
  getAllUsers,
  findByUsername,
  findUserById,
  createUser,
  updateName,
  updatePassword,
} = require('./users-db');
const validator = require('validator');
const xss = require('xss');

/**
 * Validation for the registration inputs
 *
 * @param {Object} user - User info to validate
 * @param {String} user.username - Username of user
 * @param {String} user.name - Name of user
 * @param {String} user.password - Password of user
 * @param {String} user.photo - URL to user's photo
 *
 * @returns {Promise} Promise representing a array of errors objects, empty if no errors
 */
async function validateRegister({ username, name, password, photo } = {}) { // eslint-disable-line
  const errors = [];

  if (!validator.isLength(username, { min: 3, max: 256 })) {
    errors.push({ error: 'Username must be at least 3 characters long' });
  } else {
    const userexists = await findByUsername(username);
    if (userexists) {
      errors.push({ error: 'Username is taken' });
    }
  }

  if (!validator.isLength(name, { min: 1, max: 256 })) {
    errors.push({ error: 'Name must be a string of length 1 to 255 characters' });
  }

  if (!validator.isLength(password, { min: 6, max: 256 })) {
    errors.push({ error: 'Password must at least 6 characters long' });
  }

  if (!validator.isURL(photo) && photo.length > 0) {
    errors.push({ error: 'Photo must have a valid URL' });
  }

  return errors;
}

/**
 * Validation for ID
 *
 * @param {int} id
 *
 * @returns {boolean} true if id is a Integer
 */
function validateId(id) {
  if (!validator.isInt(String(id))) {
    return false;
  }
  return true;
}

/**
 * Validate password
 *
 * @param {String} newpass - new password, at least 6 characters
 */
function validatePassword(newpass) {
  const errors = [];

  if (!validator.isLength(String(newpass), { min: 6, max: 255 })) {
    errors.push({ error: 'Password must at least 6 characters long' });
  }
  return errors;
}

function validateName(name) {
  const errors = [];

  if (!validator.isLength(name, { min: 1, max: 255 })) {
    errors.push({ error: 'Name must be a string of length 1 to 255 characters' });
  }
  return errors;
}

/**
 * Get all users
 *
 * @returns {Promise} Promise representing the object containing all users
 */
async function getAll() {
  const output = await getAllUsers();

  return output;
}

/**
 * Get one user by id
 *
 * @param {Int} id - id of the user to get
 *
 * @returns {Object} Promise representing the user object if exists
 */
async function getOneById(id) {
  if (!validateId(id)) {
    return ({ status: 400, data: { error: 'Invalid ID' } });
  }

  const output = await findUserById(id);

  if (output) {
    const data = {
      id: output.id,
      username: output.username,
      name: output.name,
      photo: output.photo,
    };

    return ({ status: 200, data });
  }
  return ({ status: 404, data: { error: 'User was not found' } });
}

/**
 * Register user asynchronously
 *
 * @param {Object} user - User to register
 * @param {String} user.username - Username of user
 * @param {String} user.name - Name of user
 * @param {String} user.password - Password of user
 * @param {String} user.photo - URL to user's photo
 *
 * @returns {Promise} Promise representing the object of the user to create
 */
async function register({ username, name, password, photo } = {}) { // eslint-disable-line
  const errors = await validateRegister({ username, name, password, photo }); //eslint-disable-line

  if (errors.length > 0) {
    return { status: 400, data: errors };
  }

  const data = {
    username: xss(username),
    name: xss(name),
    password,
    photo: xss(photo),
  };

  const output = await createUser(data);

  return { status: 200, data: output[0] };
}

async function updateUser(id, newname, newpass) {
  if (!newname && !newpass) {
    return { status: 400, data: { error: 'You must insert data to update' } };
  }

  let updatedUser;

  if (!newname) {
    const errors = validatePassword(newpass);

    if (errors.length > 0) {
      return { status: 400, data: errors };
    }
    updatedUser = await updatePassword(id, newpass);
  }

  if (!newpass) {
    const errors = validateName(newname);

    if (errors.length > 0) {
      return { status: 400, data: errors };
    }
    updatedUser = await updateName(id, newname);
  }

  const data = {
    id: updatedUser.id,
    username: updatedUser.username,
    name: updatedUser.name,
    photo: updatedUser.photo,
  };

  return { status: 200, data };
}

module.exports = {
  getAll,
  getOneById,
  register,
  updateUser,
};
