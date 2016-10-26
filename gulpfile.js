const SRC_PATH = './src/';
const ASSETS_PATH = './dist/';

var gulp         = require('gulp'),
    plumber      = require('gulp-plumber'),
    pug          = require('gulp-pug'),
    prettify     = require('gulp-prettify'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss     = require('gulp-clean-css'),
    rename       = require('gulp-rename'),
    uglify       = require('gulp-uglify'),
    dedupe       = require('gulp-dedupe'),
    concat       = require('gulp-concat'),
    rimraf       = require('gulp-rimraf'),
    ngAnnotate = require('gulp-ng-annotate'),
    watch        = require('gulp-watch'),
    batch        = require('gulp-batch');

gulp.task('build', ['clean', 'watch'], function () {
    gulp.start('scripts', 'pug', 'sass', 'vendorjs', 'vendorcss');
});

/**
 * Compile pug templates
 */
gulp.task('pug', function () {
    var YOUR_LOCALS = {};

    return gulp.src(SRC_PATH + 'pug/**/*.pug')
        .pipe(plumber())
        .pipe(pug({locals: YOUR_LOCALS}))
        .pipe(prettify({indent_size: 4}))
        .pipe(gulp.dest(ASSETS_PATH));
});

/**
 * Compile all sass
 */
gulp.task('sass', function () {
    return gulp.src(SRC_PATH + 'sass/**/*.{sass,scss,css}')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleancss())
        .pipe(rename({suffix: '.min'}))
        .pipe((gulp.dest(ASSETS_PATH + 'css')));
});

/**
 * Copy all vendor.css
 */
gulp.task('vendorcss', function () {
    gulp.src('./bower_components/**/*min.css')
        .pipe(dedupe())
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(ASSETS_PATH + 'css'))
});

/**
 * Copy all vendor.js
 */
gulp.task('vendorjs', function () {
    gulp.src('./bower_components/**/*min.js')
        .pipe(dedupe())
        .pipe(concat('vendor.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(ASSETS_PATH + 'js'));
});

/**
 * Compile all js
 */

gulp.task('scripts', function () {
    return gulp.src(SRC_PATH + 'scripts/**/*.js')
        .pipe(plumber())
        .pipe(concat('all.js'))
        .pipe(ngAnnotate({add: true}))
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest(ASSETS_PATH + 'js'));
});

/**
 * Cleanup all dirs
 */
gulp.task('clean', function () {
    return gulp.src([ASSETS_PATH] + '*', {read: false})
        .pipe(plumber())
        .pipe(rimraf({force: true}));
});

/**
 * Watch all files
 */
gulp.task('watch',
    [
        'watch.pug',
        'watch.sass',
        'watch.scripts'
    ]
);

/**;
 * Watch pug
 */
gulp.task('watch.pug', function () {
    watch(SRC_PATH + 'pug/**/*.pug', batch(function (events, done) {
        gulp.start('pug', done);
    }));
});

/**
 * Watch sass
 */
gulp.task('watch.sass', function () {
    watch(SRC_PATH + 'sass/**/*.{sass,scss}', batch(function (events, done) {
        gulp.start('sass', done);
    }));
});

/**
 * Watch scripts
 */
gulp.task('watch.scripts', function () {
    watch(SRC_PATH + 'scripts/**/*', batch(function (events, done) {
        gulp.start('scripts', done);
    }));
});