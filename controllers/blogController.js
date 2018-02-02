mongoose = require("mongoose");
const Post = mongoose.model("Post");

exports.index = (req, res) => {
  res.render("blog/blogIndex")
}

exports.addPost = (req, res) => {
  res.render('blog/editPost', {title: "Add Post"})
}

exports.getBlogPost = (req, res) => {
  res.render("blog/blogPost")
}

exports.createPost = (req, res) => {
  res.json(req.body);
}
