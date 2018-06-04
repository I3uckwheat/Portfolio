// const mongoose = require('mongoose');
// const Publication = mongoose.modle('publication');

exports.index = (req, res, next) => {
  res.render('publication/index', {title: 'Publications'});
};
