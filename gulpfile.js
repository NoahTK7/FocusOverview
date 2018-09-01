'use strict';

var gulp = require('gulp');
var zip = require('gulp-zip');

var outPath = "out/";

var buildPath = "src/*";
var outName = 'myextension.crx';

gulp.task('build', function () {
    gulp.src(buildPath)
        .pipe(zip(outName))
        .pipe(gulp.dest(outPath));
});

gulp.task('default', ['build']);