const downloadGitRepo = require('download-git-repo');
const mongoose = require('mongoose');
const App = mongoose.model('App');
const crypto = require('crypto');
const fs = require('fs');

exports.index = (req, res) => {
  res.render('apps/appsIndex');
}

exports.verifyHash = (req, res, next) => {
  const signature = Buffer.from(req.header('x-hub-signature') || '')

  const hmac = crypto.createHmac('sha1', process.env.GIT_SECRET);
  hmac.update(JSON.stringify(req.body));
  const digestedHmacBuffer = Buffer.from('sha1=' + hmac.digest('hex'));

  if(( digestedHmacBuffer.length === signature.length ) && ( crypto.timingSafeEqual(digestedHmacBuffer, signature) )) {
    res.status(202).send();
    next();
  } else {
    res.status(401).send("Incorrect secret");
  }
}

exports.update = (req, res, next) => {
  const appName = req.params.app
  const appPath = `./public/apps/${appName.toLowerCase()}`
  console.log(`Updating: ${appName}`)
  saveAppInfoToDB(req.body, appPath)
    .then((appInfo) => {
      downloadGitRepo(`${process.env.GIT_USER}/${appName}`, appPath, (err) => {if(err) console.error(err)});

      console.log(`Updated: ${appName}`)
      })
      .catch(err => next(err));
}

function saveAppInfoToDB(appInfo, localPath){
  return new Promise((resolve, reject) => {
    const appName = appInfo.repository.name;
    const formattedAppInfo = {
      githubURL: appInfo.repository.html_url,
      lastUpdated: Date.parse(appInfo.repository.updated_at),
      appName,
      localPath
    }

    App.findOneAndUpdate(
      {appName},
      formattedAppInfo,
      {new: true, upsert: true, runValidators: true}
    )
    .then(appInfo => resolve(appInfo))
    .catch(err => reject(err));
  });
}

exports.displayApps = (req, res) => {
  const app = req.params.app;
  res.send(app)
}

exports.add = (req, res) => {
  res.send('add app admin page');
}
