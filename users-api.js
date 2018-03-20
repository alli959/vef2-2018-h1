const {
  getAllUsers,
  findUserById,
  createUser,
  updateName,
  updatePassword,
} = require('./users-db');
const xss = require('xss');
const {
  validateId,
  validatePassword,
  validateName,
  validateUsername,
  validatePhoto,
} = require('./validation');


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
  const validation = [];
  validation.push(await validateUsername(username));
  validation.push(validateName(name));
  validation.push(validatePassword(password));
  if (photo) {
    validation.push(validatePhoto(photo));
  }

  const errors = [];

  validation.forEach((i) => {
    if (i) {
      errors.push(i);
    }
  });

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

/**
 * Update name and/or password of a user asyncronously
 *
 * @param {Int} id - id of the user to update
 * @param {String} newname - new name of the user
 * @param {String} newpass - new password of the user
 *
 * @returns {Promise} Promise representing the updated user
 */
async function updateUser(id, newname, newpass) {
  if (!newname && !newpass) {
    return { status: 400, data: { error: 'You must insert data to update' } };
  }

  let updatedUser;

  if (!newname) {
    const errors = validatePassword(newpass);

    if (errors) {
      return { status: 400, data: errors };
    }
    updatedUser = await updatePassword(id, newpass);
  }

  if (!newpass) {
    const errors = validateName(newname);

    if (errors) {
      return { status: 400, data: errors };
    }
    updatedUser = await updateName(id, xss(newname));
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
