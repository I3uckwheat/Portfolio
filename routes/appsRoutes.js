const express = require('express');
const router = express.Router();
const appsController = require('../controllers/appsController');

router.get('/', appsController.index);

router.post('/update/:app', appsController.verifyHash, appsController.update);

router.get('/add', appsController.add);

router.use(express.static('public/apps/'));
// router.use('/AppName', express.static('public/apps/AppName'));

module.exports = router


//TODO
// add dynamic static routes or add a control panel for adding or deleting them
