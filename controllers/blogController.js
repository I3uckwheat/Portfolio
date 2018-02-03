mongoose = require("mongoose");
const Post = mongoose.model("Post");

exports.index = (req, res) => {
  res.render("blog/blogIndex")
}

exports.getPost = (req, res, next) => {
  Post.findOne({slug: req.params.slug})
    .then((post) => {
      if(!post) return next();
      res.send(post);
    })
    .catch((err) => {
      next(err);
    })

}

exports.newPost = (req, res) => {
  res.render('blog/editPost', {title: "Add Post"})
}

exports.createPost = (req, res) => {
  const post = (new Post(req.body)).save()
    .then((post) => {
     res.redirect(`/blog/${post.slug}`);
    })
    .catch((err) => {
      next();
    })
}

exports.updatePost = (req, res) => {
  res.send("updatePost route")
}
