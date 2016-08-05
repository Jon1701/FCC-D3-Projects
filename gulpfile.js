////////////////////////////////////////////////////////////////////////////////
// Modules
////////////////////////////////////////////////////////////////////////////////
var gulp = require('gulp'); // Gulp.
var webserver = require('gulp-webserver'); // Gulp webserver.
var sass = require('gulp-sass'); // SASS.
var webpack = require('webpack-stream'); // Webpack.

////////////////////////////////////////////////////////////////////////////////
// Paths
////////////////////////////////////////////////////////////////////////////////
var srcPath = './source/';
var destPath = './build/';
var modulesPath = './node_modules/';

// Webpack
gulp.task('webpack', function() {
  gulp.src(srcPath + 'javascript/index.js')
    .pipe(webpack({
      watch: true,

      output: {
        filename: 'app.js'
      }
    }))
    .pipe(gulp.dest(destPath + 'javascript/'));
});

// Move data
gulp.task('data', function() {
  gulp.src(srcPath + 'datasets/*')
    .pipe(gulp.dest(destPath + 'datasets/'));
});

// Compile .scss and move.
gulp.task('stylesheets', function() {
  gulp.src(srcPath + 'stylesheets/**/*')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(destPath + 'stylesheets/'));
});

// Move .html.
gulp.task('html', function() {
  gulp.src(srcPath + '*.html')
    .pipe(gulp.dest(destPath));
});

////////////////////////////////////////////////////////////////////////////////
// Webserver
////////////////////////////////////////////////////////////////////////////////
gulp.task("webserver", function() {
  gulp.src(destPath)
    .pipe(webserver({
      fallback: "index.html",
      livereload: true,
      directoryListing: false,
      open: false
    }));
});

////////////////////////////////////////////////////////////////////////////////
// Watch task
////////////////////////////////////////////////////////////////////////////////
gulp.task('watch', function() {
  gulp.watch(srcPath + 'stylesheets/**/*.scss', ['stylesheets']); // SASS Main.
  gulp.watch(srcPath + 'stylesheets/**/_*.scss', ['stylesheets']); // SASS Partials.
  gulp.watch(srcPath + '*.html', ['html']);
});

////////////////////////////////////////////////////////////////////////////////
// Default task
////////////////////////////////////////////////////////////////////////////////
gulp.task('default', ['webserver', 'watch', 'data', 'stylesheets', 'html', 'webpack']);
