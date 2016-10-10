const gulp = require('gulp');
const del = require('del');
var changed = require('gulp-changed');
var debug = require('gulp-debug');
var map = require('map-stream');
var count = require('gulp-count');
var gulpIgnore = require('gulp-ignore');

// ---------------------------
//   Due to complexity on gulp typescript and tsc root, the process is now :
//      tsc compile ts to js (and js.map) in /dist
//      then gulp
//              copy js from dist to server/public
//              copy static files from src/client to server/public
//              copy needed node_modules js to server/public/vendor
// ---------------------------

var src1 = './dist/src/client';
var src2 = './src/client';
var src3 = './node_modules';
var trg1 = './src/server/public';
var trg2 = trg1;
var trg3 = trg1 + '/vendor';

var vendorNpmFiles = [
  'systemjs/dist/system-polyfills.js',
  'systemjs/dist/system.src.js',
  'zone.js/dist/**/*.+(js|js.map)',
  'core-js/client/*.+(js|js.map)',
  'reflect-metadata/**/*.+(ts|js|js.map)',
  'rxjs/**/*.+(js|js.map)',
  '@angular/**/*.+(js|js.map)',
  'marked/**/*.+(js|js.map)',
  'highlightjs/**/*.+(js|js.map|css)',
  'angular2-in-memory-web-api/**/*.+(ts|js|js.map)',
  'angular2-logger/*.+(js|js.map)',
  'angular2-logger/app/core/*.+(js|js.map)',
  'angular2-notifications/components.js',
  'angular2-notifications/lib/*.+(js|js.map)',
  'angular2-jwt/*.+(js|js.map)',
  '@angular2-material/**/*'
];


// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del(trg1 + '/**/*');
});

// TypeScript compile
gulp.task('copy_js', function () {

  return gulp.src([
    src1 + '/*.js',
    src1 + '/app/**/*.js',
    src1 + '/app/**/*.js.map'
  ], {base: src1})
  //.pipe(debug({title: 'before:'}))
    .pipe(changed(trg1))
    //.pipe(debug({title: 'copy js     : '}))
    .pipe(gulp.dest(trg1))
    .pipe(count("         'copy_js' : ##"));

});

gulp.task('copy_static', function () {

  return gulp.src([
    src2 + '/**/*.html',
    src2 + '/**/*.css',
    src2 + '/**/*.png',
    src2 + '/**/*.svg'
  ])
  //.pipe(debug({title: 'before:'}))
    .pipe(changed(trg2))
    //.pipe(debug({title: 'copy static : '}))
    .pipe(gulp.dest(trg2))
    .pipe(count("         'copy_static' : ##"));

});

gulp.task('copy_vendor', function () {

  return gulp.src([
    src3 + '/**/*.js',
    src3 + '/**/*.js.map',
    src3 + '/**/*.css'
  ])
    .pipe(gulpIgnore.include(vendorNpmFiles))
    //.pipe(debug({title: 'before:'}))
    .pipe(changed(trg3))
    //.pipe(debug({title: 'copy vendor : '}))
    .pipe(gulp.dest(trg3))
    .pipe(count("         'copy_vendor' : ##"));

});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(src1+'/**/*', ['copy_js']);
  gulp.watch(src2+'/**/*', ['copy_static']);
  // gulp.watch(src3+'/*/*', ['copy_vendor']);
});


gulp.task('copy', ['copy_js', 'copy_static', 'copy_vendor']);

gulp.task('build', ['copy']);
gulp.task('default', ['clean', 'watch', 'build']);
