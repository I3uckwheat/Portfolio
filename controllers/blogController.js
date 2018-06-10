const mongoose = require("mongoose");
const postUpdateHelper = require('../helpers/postUpdateHelper.js');

const Post = mongoose.model("Post");

exports.index = async (req, res, next) => {
  try{
    const dates = await Post.aggregate([
      { $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        posts: { $push: '$$ROOT' }
      }},
      { $sort: {'_id.year': -1, '_id.month': -1 } },
      { $project: { _id: 0, posts: 1, date: { year: '$_id.year', month: '$_id.month' } } }
    ]).exec();

    res.render('blog/index', {title: 'plaintext', dates});
  } catch(err) {
    console.log(err);
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const post = await Post.findOne({slug: req.params.slug});
  res.render('blog/blog', {title: post.title, post});
};

exports.downloadPosts = async (req, res, next) => {
  console.log('downloading Posts');
  try {
    await postUpdateHelper.downloadPosts();
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updatePosts = async (req, res, next) => { // markdown -> html and store in DB FIXME - better errors
  const result = await postUpdateHelper.updatePosts(mongoose);
  if (result === 'success') return res.send('<h1>Posts Updated</h1>');
  return res.send('<h1>Posts Failed To Update</h1>');
};
