const gulp = require('gulp')
gulp.task('cp', function () {
    gulp.src('./packages/*/package.json').pipe(gulp.dest('./dist/'))
})
