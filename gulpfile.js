'use strict';

const fs = require('file-system');
const gulp = require('gulp');
const zip = require('gulp-zip');

const outPath = "out/";

const buildPath = "src/**";
const assetPath = "assets/**";
const manifest = "manifest.json";

const date = (new Date()).toLocaleString().replace(/([/])/g, "-");
const outName = "FocusOverview_upload-"+date+".zip";

gulp.task('build', function () {
    return gulp.src([buildPath, assetPath, manifest], {base: '.'})
        .pipe(zip(outName))
        .pipe(gulp.dest(outPath));
});

gulp.task('default', ['build']);