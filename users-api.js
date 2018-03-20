const xss = require('xss');
const cloudinary = require('cloudinary');
const {
  getAllUsers,
  findUserById,
  createUser,
  updateName,
  updatePassword,
  updatePhoto,
} = require('./users-db');
const {
  validatePassword,
  validateName,
  validateUsername,
  validatePhoto,
} = require('./validation');

const {
  CLOUDINARY_CLOUD,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

if (!CLOUDINARY_CLOUD || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn('Missing cloudinary config, uploading images will not work');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

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

  validation.forEach((error) => {
    if (error) {
      errors.push(error);
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

/**
 * Uploads photo to cloudinary and saves url to database
 *
 * @param {Int} id - id of user, owner of photo
 * @param {String} - path to image
 *
 * @returns {Promise} Promise representing the updated user
 */
async function uploadPhoto(id, file) {
  if (!file) {
    return { status: 400, data: { error: 'Couldn\'t find file' } };
  }
  const { path } = file;

  if (!path) {
    return { status: 400, data: { error: 'Can\'t read file path' } };
  }

  let upload = null;

  try {
    upload = await cloudinary.v2.uploader.upload(path);
  } catch (err) {
    console.error(err);
    throw err;
  }

  const { secure_url } = upload; // eslint-disable-line

  const data = await updatePhoto(id, secure_url);

  return { status: 200, data };
}


module.exports = {
  getAll,
  getOneById,
  register,
  updateUser,
  uploadPhoto,
};
