const mongoose = require('mongoose');
const childProcess = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const postUpdateHelper = require('./helpers/postUpdateHelper.js');

require('dotenv').config({path: 'variables.env'});

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(err.message);
});

require("./models/Blog.js");

if(!fs.existsSync('./public/blogPosts/')) {
  console.log('initializing Blogs');
  const gitClone = childProcess.execFileSync(path.resolve(__dirname, 'helpers', 'scripts', 'initBlogs.sh'), [process.env.BLOG_REPO]);
  console.log('syncing with db');
};

postUpdateHelper.updatePosts(mongoose)
  .then(result => {
    const app = require('./app');
    app.set('port', process.env.PORT || 7777);
    const server = app.listen(app.get('port'), () => {
      console.log(`Express running → PORT ${server.address().port}`);
    });
  })
  .catch(err => {
    console.error(err);
  });

