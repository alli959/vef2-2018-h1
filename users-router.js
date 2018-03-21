const express = require('express');
const multer = require('multer');
const {
  getAll,
  getOneById,
  updateUser,
  uploadPhoto,
  addReadBook,
} = require('./users-api');
const { requireAuthentication } = require('./authentication');

const uploads = multer({ dest: './temp' });

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.get('/', /* requireAuthentication, */ async (req, res) => {
  const data = await getAll();

  res.status(200).json(data);
});

router.get('/me', requireAuthentication, async (req, res) => {
  const { user } = req;
  const { id } = user;

  const { status, data } = await getOneById(id);
  return res.status(status).json(data);
});

router.patch('/me', requireAuthentication, async (req, res) => {
  const { name, password } = req.body;
  const { user: { id } } = req;

  const { status, data } = await updateUser(id, name, password);
  return res.status(status).json(data);
});

router.post('/me/profile', requireAuthentication, uploads.single('image'), async (req, res) => {
  const { file } = req;
  const { user: { id } } = req;

  const { status, data } = await uploadPhoto(id, file);
  return res.status(status).json(data);
});

router.get('/me/read', requireAuthentication, (req, res) => {

});

router.post('/me/read', requireAuthentication, async (req, res) => {
  const { user: { id } } = req;
  const { bookid, grade, comments } = req.body;

  const { status, data } = await addReadBook(id, bookid, grade, comments);
  return res.status(status).json(data);
});

router.delete('/me/read/:id', requireAuthentication, (req, res) => {
  const { id } = req.body;
});

router.get('/:id', requireAuthentication, async (req, res) => {
  const { id } = req.params;
  const { status, data } = await getOneById(id);

  res.status(status).json(data);
});

module.exports = router;
