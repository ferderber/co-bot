var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint');
gulp.task('lint', function() {
    gulp.src('./**/*.js')
        .pipe(jshint())
});
gulp.task('default', function() {
    nodemon({
        script: 'index.js',
        ext: 'js',
        watch: ['command', 'models'],
        env: {
            'NODE_ENV': 'dev'
        },
        tasks: ['lint']
    });
});
