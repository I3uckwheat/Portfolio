const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');

router.get('/', blogController.index); // Shows all blog posts
router.get('/:slug', blogController.getPost); // get's post and shows it to client
router.get('/update', blogController.updatePosts); // REMOVE TEST ROUTE
router.post('/update',
            authController.verifyWebhook, // TODO - setup webhook
            blogController.updatePosts); // parses markdown files and updates in DB


module.exports = router;
