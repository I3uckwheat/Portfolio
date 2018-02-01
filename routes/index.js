const express = require('express');
const router = express.Router();

const blog = require("./blogRoutes")

const {catchErrors} = require('../handlers/errorHandlers');

router.get('/', (req, res) => {
  res.render('landingPage')
})

router.use('/blog', blog)

module.exports = router;
