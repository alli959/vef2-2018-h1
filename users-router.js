const express = require('express');
const multer = require('multer');
const {
  getAll,
  getOneById,
  updateUser,
  uploadPhoto,
  addReadBook,
  getReadBooks,
  removeReadBy,
} = require('./users-api');
const { requireAuthentication } = require('./authentication');

const { PAGE_LIMIT: limit = 10 } = process.env;

const uploads = multer({ dest: './temp' });

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.get('/', requireAuthentication, async (req, res) => {
  const { query: { offset = 0 } } = req;
  const { status, data } = await getAll(offset, limit);

  res.status(status).json({ limit, offset, items: data });
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

router.get('/me/read', requireAuthentication, async (req, res) => {
  const { user: { id } } = req;
  const { query: { offset = 0 } } = req;

  const { status, data } = await getReadBooks(id, offset, limit);
  return res.status(status).json({ limit, offset, items: data });
});

router.post('/me/read', requireAuthentication, async (req, res) => {
  const { user: { id } } = req;
  const { bookid, grade, comments } = req.body;

  const { status, data } = await addReadBook(id, bookid, grade, comments);
  return res.status(status).json(data);
});

router.delete('/me/read/:id', requireAuthentication, async (req, res) => {
  const readId = req.params.id;
  const { user: { id } } = req;

  const { status, data } = await removeReadBy(id, readId);
  return res.status(status).json(data);
});

router.get('/:id/read', requireAuthentication, async (req, res) => {
  const { params: { id } } = req;
  const { query: { offset = 0 } } = req;

  const { status, data } = await getReadBooks(id, offset, limit);
  res.status(status).json({ limit, offset, items: data });
});

router.get('/:id', requireAuthentication, async (req, res) => {
  const { id } = req.params;
  const { status, data } = await getOneById(id);

  res.status(status).json(data);
});

module.exports = router;
