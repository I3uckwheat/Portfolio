const express = require("express")
const router = express.Router();
const blogController = require("../controllers/blogController")

router.get("/", blogController.index)
router.get("/new", blogController.addPost)
router.post("/", blogController.createPost)
router.get("/:id", blogController.getBlogPost)


module.exports = router
