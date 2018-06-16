const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');

router.get('/', blogController.index); // Shows all blog posts
router.post('/update',
            authController.verifyWebhook,
            blogController.downloadPosts,
            blogController.updatePosts); // parses markdown files and updates in DB
router.get('/:slug', blogController.getPost); // get's post and shows it to client

module.exports = router;
