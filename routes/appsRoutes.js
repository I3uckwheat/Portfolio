const express = require("express")
const router = express.Router();
const appsController = require("../controllers/appsController")

router.get("/", appsController.index)


module.exports = router
