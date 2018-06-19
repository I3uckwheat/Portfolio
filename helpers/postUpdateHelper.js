const path = require('path');
const fs = require('fs-extra');
const showdown = require('showdown');
const childProcess = require('child_process');

const root = path.join(process.mainModule.paths[0].split('node_modules')[0].slice(0, -1));

exports.updatePosts = async (mongoose) => {
  const Post = mongoose.model('Post');

  const [postsDir, renderedPosts] = await Promise.all([
    fs.readdir(path.join(root, 'public', 'blogPosts')),
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
};

exports.downloadPosts = async () => { // TODO - better errors
  return new Promise((resolve, reject) => {
    childProcess.execFile(path.resolve(root, 'helpers', 'scripts', 'downloadBlogs.sh'), (err, stdout, stderr) => {
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

async function renderPost(postName) {
  console.log('rendering', postName);
  const mdConverter = new showdown.Converter({strikethrough: true, simpleLIneBreaks: true, tables: true});
  const [markDown, meta] = await Promise.all([
    fs.readFile(path.join(root, 'public', 'blogPosts', postName, `${postName}.md`)),
    fs.readFile(path.join(root, 'public', 'blogPosts', postName, 'meta.json'))
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

async function updatePost (renderedPost, model) {
  await model.findOneAndUpdate({fileName: renderedPost.fileName}, {...renderedPost}, {upsert: true}).exec();
}
