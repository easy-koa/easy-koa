const gulp = require('gulp');
const rm = require( 'gulp-rm' );


gulp.task('clear', function () {
    return gulp.src( [
        'examples/**/*.js',
        'examples/**/*.js.map',
        'examples/**/*.d.ts',
        '!examples/**/node_modules/**',

        'packages/**/*.js',
        'packages/**/*.js.map',
        'packages/**/*.d.ts',
        '!packages/**/@types/**/index.d.ts',
        '!packages/**/node_modules/**'
    ], { read: false })
        .pipe( rm({ async: false }) )
})
