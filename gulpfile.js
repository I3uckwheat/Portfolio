const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const nodemon = require('gulp-nodemon');
const changed = require('gulp-changed');


gulp.task('default', ['build']);
gulp.task('build', ['compile-css', 'compress-images']); // TODO - add sourcemaps

gulp.task('start', () => {
  const stream = nodemon({
    script: 'start.js',
    ext: 'js pug ',
    tasks: ['dev'],
    done: 'done'
  });
});

gulp.task('compile-css', () => {
  const src = './public/stylesheets/**/*';
  const dest = './public/dist/stylesheets';
  return gulp.src(src)
    .pipe(changed(dest))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(dest));
});

gulp.task('compress-images', () => {
  const src = './public/images/**/*';
  const dest = './public/dist/images';
  return gulp.src(src)
    .pipe(changed(dest))
    .pipe(imagemin())
    .pipe(gulp.dest(dest));
});
