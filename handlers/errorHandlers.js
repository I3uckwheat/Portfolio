const mongoose = require('mongoose');

const EError = mongoose.model('EError');

exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

exports.validationError = (err, req, res, next) => {
  if (!err.errors) return next(err);
  for (const errorKey in err.errors) {
    req.flash('error', err.errors[errorKey].message);
  }
  res.redirect('back');
};

exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      '<mark>$&</mark>'
    )
  };
  res.status(err.status || 500);
  res.format({
    //based on the 'accept' http header
    'text/html': () => {
      res.render('error', { ...errorDetails, title: err.status });
    },
    'application/json': () => res.json(errorDetails)
  });
};

exports.productionErrors = async (err, req, res, next) => {
  res.status(err.status || 500);

  const error = new EError({
    title: err.status,
    message: err.message,
    err: JSON.stringify(err),
    date: new Date
  });

  try {
    if (!err.status === 404) {
      console.log('ERROR STORED');
      await error.save();
    }

    res.render('error', {
      title: err.status,
      message: err.message,
      error: {}
    });
  } catch (error) {
    res.render('error', {
      title: err.status,
      message: err.message,
      error: {}
    });
  }
};
