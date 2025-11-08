const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getArticles)
  .post(protect, admin, upload.single('image'), createArticle);

router.route('/:id')
  .get(getArticle)
  .put(protect, admin, upload.single('image'), updateArticle)
  .delete(protect, admin, deleteArticle);

module.exports = router; 