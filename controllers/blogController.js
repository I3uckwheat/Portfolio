const mongoose = require("mongoose");
const showdown = require('showdown');
const path = require('path');
const fs = require('fs-extra');

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

exports.updatePosts = async (req, res, next) => { // markdown -> html and store in DB
  try {
    const [preRenderedPosts, renderedPosts] = await Promise.all([
      fs.readdir('../Portfolio/public/blogPosts'),
      Post.find({}, {fileName: true})
    ]);
    const renderedPostNames = renderedPosts.map(post => post.fileName);

    await Promise.all(preRenderedPosts.map(async postName => {
      if(renderedPostNames.includes(postName)) {
        console.log('skipping: ', postName);
        return null;
      }
      return storePost(await renderPost(postName));
    }));

    res.send('<h1>Posts Updated</h1>');
  } catch(err) {
    console.log('\n\n Posts Failed to Update \n');
    console.error(err);
    console.log('\n\n');

    res.send('<h1>Posts Updating Failed</h1>');
  }
};

async function renderPost(postName) { // todo - handle errors
  const mdConverter = new showdown.Converter();
  const [markDown, meta] = await Promise.all([
    fs.readFile(`../Portfolio/public/blogPosts/${postName}/${postName}.md`),
    fs.readFile(`../Portfolio/public/blogPosts/${postName}/meta.json`)
  ]);
  const htmlString = mdConverter.makeHtml(markDown.toString());
  const metaData = JSON.parse(meta);

  return {
    ...metaData,
    fileName: postName,
    body: htmlString,
  };
}

function storePost(renderedPost) { // todo - handle errors
  const post = new Post(renderedPost).save();
}
