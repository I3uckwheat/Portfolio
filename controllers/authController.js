exports.isAdmin = (req, res, next) => {
  console.log('ADMIN ROUTE NOT SECURED'); // todo - add passport
  next();
};

exports.verifyWebhook = (req, res, next) => {
  next();
};
