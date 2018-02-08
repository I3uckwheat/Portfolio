const express = require('express')
const router = express.Router();
const appsController = require('../controllers/appsController')

router.get('/', appsController.index)

router.post('/update/:app', appsController.verifyHash, appsController.update)

router.use('/snake', express.static('public/apps/Snake-JS'))

module.exports = router
