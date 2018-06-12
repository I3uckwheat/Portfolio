exports.index = (req, res, next) => {
  res.render('projects/index', {title: 'projects'});
};
