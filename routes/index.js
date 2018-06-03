const express = require('express');
const router = express.Router();

const blog = require('./blogRoutes');
const apps = require('./appsRoutes');
const publications = require('./publicationsRoutes');

const {catchErrors} = require('../handlers/errorHandlers');

router.get('/', (req, res) => {
  res.render('landingPage/landingPage');
});

router.get('/more', (req, res) => {
    res.render('learnMore', {title: "Learn More"});
});

router.use('/love-mikinze', express.static('public/apps/mikinze'));

router.use('/blog', blog);
router.use('/publications', publications);
router.use('/apps', apps);

module.exports = router;
