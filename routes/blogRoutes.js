const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');

router.get('/', blogController.index); // Shows all blog posts
router.post('/update', blogController.updatePosts); // parses markdown files and updates in DB
router.get('/update', blogController.updatePosts); // parses markdown files and updates in DB
router.get('/:slug', blogController.getPost); // shows one post
// router.get('/:slug/edit', blogController.editPost); // Shows edit page (new blog post page with filled data)

module.exports = router;
