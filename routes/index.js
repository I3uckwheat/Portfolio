const express = require('express');
const router = express.Router();

const {catchErrors} = require('../handlers/errorHandlers');

router.get('/', (req, res) => {
  res.render('landingPage')
})

module.exports = router;
