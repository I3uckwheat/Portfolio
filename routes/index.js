const express = require('express');
const router = express.Router();

const blog = require('./blogRoutes')
const apps = require('./appsRoutes')

const {catchErrors} = require('../handlers/errorHandlers');

router.get('/', (req, res) => {
  res.render('landingPage')
})

router.use('/blog', blog)

router.use('/apps', apps)

module.exports = router;
