const mongoose = require('mongoose');
const childProcess = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const postUpdateHelper = require('./helpers/postUpdateHelper.js');

require('dotenv').config({ path: 'variables.env' });

const root = path.join(
  process.mainModule.paths[0].split('node_modules')[0].slice(0, -1)
);

mongoose.connect(process.env.DATABASE, {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
});

mongoose.Promise = global.Promise;
mongoose.connection.on('error', err => {
  console.error(err.message);
});

require('./models/Blog.js');
require('./models/Error.js');

console.log(root);

if (!fs.existsSync(path.join(root, 'public', 'blogPosts'))) {
  console.log('initializing Blogs');
  const gitClone = childProcess.execFileSync(
    path.resolve(root, 'helpers', 'scripts', 'initBlogs.sh'),
    [root, process.env.BLOG_REPO]
  );
  console.log('syncing with db');
}

postUpdateHelper
  .updatePosts(mongoose)
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
