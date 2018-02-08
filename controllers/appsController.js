const downloadGitRepo = require('download-git-repo');
const crypto = require('crypto');

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
    console.log("varified")
    next();
  } else {
    res.status(401).send("Incorrect secret");
  }
}

exports.update = (req, res) => {
  const appName = req.params.app
  console.log(`Updating: ${appName}`)
  downloadGitRepo(`${process.env.GIT_USER}/${appName}`,
                  `./public/apps/${appName}`,
                    (err) => {if(err) console.error(err)});

  console.log(`Updated: ${appName}`)
}
