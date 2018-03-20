const validator = require('validator');
const { findByUsername } = require('./users-db');

/**
 * Validation for ID
 *
 * @param {int} id
 *
 * @returns {boolean} true if id is a Integer
 */
function validateId(id) {
  if (!validator.isInt(String(id))) {
    return { error: 'ID must be an integer' };
  }
  return false;
}

/**
 * Validation for password
 *
 * @param {String} password - password, at least 6 characters
 *
 * @return {Object} - Error object if name is invalid
 */
function validatePassword(password) {
  if (!validator.isLength(password, { min: 6, max: 255 })) {
    return { error: 'Password must at least 6 characters long' };
  }
  return false;
}

/**
 * Validation for name
 *
 * @param {String} name - name, minimum length: 1
 *
 * @returns {Object} - Error object if name is invalid
 */
function validateName(name) {
  if (!validator.isLength(name, { min: 1, max: 255 })) {
    return { error: 'Name must be a string of length 1 to 255 characters' };
  }
  return false;
}

/**
 * Validation for username
 *
 * @param {String} username - username, minimum length: 3, must be unique
 *
 * @returns {Object} - Error object if name is invalid
 */
async function validateUsername(username) {
  if (!validator.isLength(username, { min: 3, max: 256 })) {
    return { error: 'Username must be at least 3 characters long' };
  }
  const userexists = await findByUsername(username);
  if (userexists) {
    return { error: 'Username is taken' };
  }
  return false;
}

/**
 * Validation for photo
 *
 * @param {String} photo - photo url, must be a valid url
 *
 * @returns {Object} - Error object if name is invalid
 */
function validatePhoto(photo) {
  if (!validator.isURL(photo)) {
    return { error: 'Photo must have a valid URL' };
  }
  return false;
}

module.exports = {
  validateId,
  validatePassword,
  validateName,
  validateUsername,
  validatePhoto,
};
