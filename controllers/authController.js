const crypto = require('crypto');
exports.verifyWebhook = (req, res, next) => {
  const githubSignature = req.headers['x-hub-signature'];
  if (!githubSignature) return res.status(400).send('No signature');

  const remoteSha1Signature = Buffer.from(req.headers['x-hub-signature']);

  const hmac = crypto.createHmac('sha1', process.env.GIT_SECRET);
  hmac.update(JSON.stringify(req.body));
  const localSha1Signature = Buffer.from('sha1=' + hmac.digest('hex'));

  if(crypto.timingSafeEqual(localSha1Signature, remoteSha1Signature)) {
    console.log('github validated');
    next();
  } else {
    res.status(403).send('Invalid Secret');
  }
};
