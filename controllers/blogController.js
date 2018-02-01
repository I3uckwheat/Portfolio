exports.index = (req, res) => {
  res.render("blog/blogIndex")
}

exports.getBlogPost = (req, res) => {
  res.render("blog/blogPost")
}
