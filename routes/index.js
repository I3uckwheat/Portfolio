const express = require('express');
const router = express.Router();

const blog = require('./blogRoutes');
const publications = require('./publicationsRoutes');

const {catchErrors} = require('../handlers/errorHandlers');

router.get('/', (req, res) => {
  res.render('landingPage/landingPage');
});

router.use('/love-mikinze', express.static('public/apps/mikinze'));

router.use('/blog', blog);
router.use('/publications', publications);

module.exports = router;
