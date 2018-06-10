const fs = require('fs-extra');
const showdown = require('showdown');
const childProcess = require('child_process');

exports.updatePosts = async (mongoose) => {
  const Post = mongoose.model('Post');

  try {
    const [postsDir, renderedPosts] = await Promise.all([
      fs.readdir('../Portfolio/public/blogPosts'),
      Post.find({}, {fileName: true})
    ]);

    const preRenderedPosts = postsDir.filter(contents => {
      if(contents !== 'README.md' && contents[0] !== '.') return contents;
      return null;
    });

    const renderedPostNames = renderedPosts.map(post => post.fileName);

    await Promise.all(preRenderedPosts.map(async postName => {
      if(renderedPostNames.includes(postName)) return updatePost(await renderPost(postName), Post);
      return storeNewPost(await renderPost(postName), Post);
    }));

    console.log('Posts Updated');
    return 'success';
  } catch(err) {
    console.log('Posts Failed to Update', err);
    return 'failure';
  }
};

exports.downloadPosts = async () => {
  return new Promise((resolve, reject) => {
    childProcess.execFile('./helpers/scripts/downloadBlogs.sh', (err, stdout, stderr) => {
      console.log(stdout.toString());
      if (err) {
        console.log(stderr);
        console.log(`Failed to download posts ${err}`);
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
 };

async function renderPost(postName) { // todo - handle errors
  console.log('rendering', postName);
  const mdConverter = new showdown.Converter({strikethrough: true, simpleLIneBreaks: true, tables: true});
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

async function storeNewPost (renderedPost, model) {
  await model.create(renderedPost);
  return 'success';
};

async function updatePost (renderedPost, model) { // TODO - error handling
  await model.findOneAndUpdate({fileName: renderedPost.fileName}, {...renderedPost}, {upsert: true}).exec();
  return 'success';
}
