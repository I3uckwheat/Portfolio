const mongoose = require("mongoose");
const showdown = require('showdown');
const path = require('path');
const fs = require('fs-extra');

const Post = mongoose.model("Post");

exports.index = (req, res, next) => {
  res.render('blog/index', {title: 'plaintext'});
};

exports.getPost = (req, res, next) => {
  // get blog post and send to view
  res.send("showPost route");
};

exports.updatePosts = async (req, res, next) => { // markdown -> html and store in DB
  try {
    const [preRenderedPosts, renderedPosts] = await Promise.all([
      fs.readdir('../Portfolio/public/blog'),
      Post.find({}, {fileName: true})
    ]);
    const renderedPostNames = renderedPosts.map(post => post.fileName);

    await Promise.all(preRenderedPosts.map(async postName => {
      if(!renderedPostNames.includes(postName)) {
        const renderedPost = await renderPost(postName);
        return storePost(renderedPost);
      }
      console.log('skipping: ', postName);
      return null;
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
    fs.readFile(`../Portfolio/public/blog/${postName}/${postName}.md`),
    fs.readFile(`../Portfolio/public/blog/${postName}/meta.json`)
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
