const downloadGitRepo = require('download-git-repo');
const crypto = require('crypto');

exports.index = (req, res) => {
  res.render('apps/appsIndex');
}

exports.verifyHash = (req, res, next) => {
  // if(req.body. = crypto.createDecipher('sha1', process.env.GITHUB_SECRET)
}

exports.update = (req, res) => {
  const appName = req.params.app
  console.log(`Updating: ${appName}`)
  // downloadGitRepo(`${process.env.GIT_USER}/${appName}`,
  //                 `./public/apps/${appName}`,
  //                 (err) => console.error(err));
  res.status(202).send()
}
