const gulp = require('gulp')
gulp.task('cp', function () {
    gulp.src('./packages/*/package.json').pipe(gulp.dest('./dist/packages'))
    gulp.src('./examples/*/package.json').pipe(gulp.dest('./dist/examples'))
})
