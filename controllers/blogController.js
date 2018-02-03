mongoose = require("mongoose");
const Post = mongoose.model("Post");

exports.index = (req, res) => {
  res.render("blog/blogIndex")
}

exports.newPost = (req, res) => {
  res.render('blog/editPost', {title: "Add Post"})
}

exports.createPost = (req, res, next) => {
  const post = (new Post(req.body)).save()
    .then((post) => {
     res.redirect(`/blog/${post.slug}`);
    })
    .catch((err) => {
      next(err);
    })
}

exports.updatePost = (req, res, next) => {
  const postId = req.params.id;
  Post.findOneAndUpdate({_id: postId}, req.body, {
    new: true,
    runValidators: true
  }).exec()
    .then((post) => {
      res.redirect(`/blog/${post.slug}`);
    })
    .catch((err) => {
      return next(err);
    });
}

exports.editPost = (req, res, next) => {
  const slug = req.params.slug;
  const post = Post.findOne({slug})
    .then((post) => {
      if(!post) return next();
      res.render('blog/editPost', {title: `Edit "${post.title}"`, post})
    })
    .catch((err) => {
      return next(err)
    })
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

exports.deletePost = (req, res, next) => {
  res.send("delete post")
}
