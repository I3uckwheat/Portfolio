mongoose = require("mongoose");
const Post = mongoose.model("Post");

exports.index = (req, res, next) => {
  Post.find()
    .then((posts) => {
      if(!posts) return next();
      res.render('blog/blogIndex', {posts})
      // res.send(posts)
    })
    .catch((err) => {
      return next(err);
    })
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

exports.seperateTags = (req, res, next) => {
  req.body.tags = req.body.tags.split(',')
  next();
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
      res.render('blog/blogPost', {post});
    })
    .catch((err) => {
      next(err);
    })
}

exports.deletePost = (req, res, next) => {
  res.send("delete post")
}
