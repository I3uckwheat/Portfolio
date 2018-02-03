const express = require("express")
const router = express.Router();
const blogController = require("../controllers/blogController")

router.get("/", blogController.index)
router.get("/new", blogController.newPost)
router.post("/new", blogController.createPost)
router.post("/new/:id", blogController.updatePost);
router.get("/:slug", blogController.getPost)


module.exports = router
