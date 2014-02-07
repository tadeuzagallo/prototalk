var _ = require('lodash');
var express = require('express');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var lr = require('tiny-lr');

var browserify = require('gulp-browserify');
var coffee = require('gulp-coffee');
var coffeelint = require('gulp-coffeelint');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var haml = require('gulp-haml');
var jshint = require('gulp-jshint');
var refresh = require('gulp-livereload');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');

var server = lr();

var config = _.extend({
  port: 8000,
  lrport: 35729,
  env: 'development',
  js: './src/js/**/*.coffee',
  css: './src/css/**/*.scss',
  html: './src/**/*.haml',
  theme: 'default'
}, gutil.env);

console.log(config);

gulp.task('jshint', function () {
  gulp
    .src(['Gulpfile.js', 'src/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('coffeelint', function () {
  gulp
    .src(config.js)
    .pipe(coffeelint())
    .pipe(coffeelint.reporter('coffeelint-stylish'));
});

gulp.task('pre-js', ['jshint', 'coffeelint'], function () {
  gulp
    .src(config.js)
    .pipe(coffee())
    .pipe(concat('tmp.js'))
    .pipe(gulp.dest('./out/js'));
});

gulp.task('js', ['pre-js'], function () {
  gulp
    .src(['./node_modules/reveal.js/js/reveal.js', './out/js/tmp.js'])
    .pipe(gulpif(config.env === 'production', uglify()))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./out/js'))
    .pipe(refresh(server));
});

gulp.task('pre-css', function () {
  gulp
    .src(config.css)
    .pipe(sass())
    .pipe(concat('tmp.css'))
    .pipe(gulp.dest('./out/css'));
});

gulp.task('css', ['pre-css'], function () {
  gulp
    .src(['./node_modules/reveal.js/css/reveal.css', './node_modules/reveal.js/css/theme/' + config.theme + '.css', './out/css/tmp.css'])
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./out/css'))
    .pipe(refresh(server));
});

gulp.task('html', function () {
  gulp
  .src(config.html)
  .pipe(haml())
  .pipe(gulp.dest('./out'))
  .pipe(refresh(server));
});

gulp.task('build', ['js', 'css', 'html']);

gulp.task('watch', function () {
  ['js', 'css', 'html'].forEach(function (type) {
    gulp.watch(config[type], [type]);
  });
});

gulp.task('lr-server', function() {
  server.listen(config.lrport, function (err) {
    if (err) {
      console.log(err);
    }
  });
});

gulp.task('server', ['build', 'lr-server', 'watch'], function () {
  express()
    .use(express.static('./out'))
    .use(express.directory('./out'))
    .listen(config.port, function () {
      console.log('Server listening on port %s', config.port);
    });
});
