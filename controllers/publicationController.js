exports.index = (req, res, next) => {
  res.render('publication/index', {title: 'publications'});
};
