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

exports.update = (req, res) => {
  const appName = req.params.app
  console.log(`Updating: ${appName}`)
  console.log(appName)
  downloadGitRepo(`${process.env.GIT_USER}/${appName}`,
                  `./public/apps/${appName.toLowerCase()}`,
                    (err) => {if(err) console.error(err)});

  console.log(`Updated: ${appName}`)
}

exports.displayApps = (req, res) => {
  const app = req.params.app;
  res.send(app)
}

exports.add = (req, res) => {
  res.send('add app admin page');
}
