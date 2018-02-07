const downloadGitRepo = require('download-git-repo');

exports.index = (req, res) => {
  res.render('apps/appsIndex');
}

exports.update = (req, res) => {
  const appName = req.params.app
  console.log(`Updating: ${appName}`)
  downloadGitRepo(`${process.env.GIT_USER}/${appName}`,
                  `./public/apps/${appName}`,
                  (err) => console.error(err));
}
