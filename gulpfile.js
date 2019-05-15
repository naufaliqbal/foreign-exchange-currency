var gulp = require('gulp'),
    less = require('gulp-less'),
    pump = require('gulp-plumber'),
    rename = require('gulp-rename'),
    cleanCssPlugin = require('less-plugin-clean-css')

var cleanCss = new cleanCssPlugin({ advanced: true })

// convert less to min.css
gulp.task('build-less', async function () {
    return gulp.src(['less/*.less'])
        .pipe(pump())
        .pipe(less({
            plugins: [cleanCss]
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('public/css/'))
})

// watch less and js changes
gulp.task('watch', function() {
  gulp.watch('less/*.less', gulp.series('build-less'));
});