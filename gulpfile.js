//TODO - sourcemaps when needed
//TODO - setup npm script

const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');

gulp.task('default', ['compile-css', 'compress-images']);

gulp.task('compile-css', () => {
  return gulp.src('./public/stylesheets/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./public/dist/stylesheets'));
});

gulp.task('compress-images', () => {
  return gulp.src('./public/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./public/dist/images'));
});
