const express = require('express')
const router = express.Router();
const blogController = require('../controllers/blogController')

router.get('/', blogController.index); // Shows all blog posts
router.get('/new', blogController.newPost); // Shows new blog post page
router.post('/new', blogController.createPost); // Adds new blog to DB
router.post('/new/:id', blogController.updatePost); // updates existing post
router.get('/:slug/edit', blogController.editPost); // Shows edit page (new blog post page with filled data)
router.get('/:slug', blogController.getPost); // shows one post
router.post('/:slug', blogController.deletePost); // deletes specified post


module.exports = router
