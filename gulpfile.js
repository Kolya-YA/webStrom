"use strict";

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/css/images/',
        fonts: 'build/fonts/',
        htaccess: 'build/',
        contentImg: 'build/img/',
        sprites: 'src/css/images/',
        spritesCss: 'src/css/partial/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/index.html', //Синтаксис src/template/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/[^_]*.js',//В стилях и скриптах нам понадобятся только main файлы
        jshint: 'src/blocks/**/*.js',
        css: 'src/main.css',
        //cssVendor: 'src/css/vendor/*.*', //Если мы хотим файлы библиотек отдельно хранить то раскоментить строчку
        //img: 'src/css/images/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*',
        //contentImg: 'src/img/**/*.*',
        //sprites: 'src/css/sprites/*.png',
        //htaccess: 'src/.htaccess'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        all: 'build/**/*.*',
        html: 'src/**/*.html',
        js: 'src/blocks/**/*.js',
        css: 'src/blocks/**/*.css',
        //img: 'src/css/images/**/*.*',
        //contentImg: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        //htaccess: 'src/.htaccess',
        //sprites: 'src/css/sprites/*.png'
    },
    clean: './build', //директории которые могут очищаться
    outputDir: './build' //исходная корневая директория для запуска минисервера
};

var gulp = require('gulp'),
  notify = require('gulp-notify'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require("gulp-rename"),
  rigger = require('gulp-rigger'),
  debug = require('gulp-debug'),
  del = require('del'),
  plumber = require('gulp-plumber'),
  postcss = require('gulp-postcss'),
  jshint = require('gulp-jshint'),
  clean = require('gulp-clean'),
  browserSync = require('browser-sync').create();


gulp.task('browserSync', function() {
  browserSync.init({server: path.outputDir});
});

gulp.task('html', function () {
  gulp.src(path.src.html)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html));
});

gulp.task('css', function() {
  return gulp.src(path.src.css)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(postcss([
      require("postcss-import"),
      require('postcss-cssnext'),
      // require('cssnano')({ autoprefixer: false })
    ]))
    .pipe(sourcemaps.write())
    .pipe(rename({basename: 'style', suffix: '.min'}))
    .pipe(gulp.dest(path.build.css));
});

gulp.task('fonts', function() {
  return gulp.src(path.src.fonts)
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest(path.build.fonts));
});

gulp.task('jshint', function() {
    return gulp.src(path.src.jshint)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
      
gulp.task('js', function() {
  return gulp.src(path.src.js)
    .pipe(sourcemaps.init())
    .pipe(rigger())
    .pipe(sourcemaps.write())
    .pipe(rename({dbasename: 'main', suffix: '.min'}))
    .pipe(gulp.dest(path.build.js));
});

gulp.task('clean', function() {
  return del(path.clean);
});

gulp.task('watch', function() {
  gulp.watch(path.watch.css, ['css'])
  gulp.watch(path.watch.js, ['js'])
  gulp.watch(path.watch.html, ['html'])
  gulp.watch(path.watch.fonts, ['fonts'])
  gulp.watch(path.watch.all, browserSync.reload);
});

gulp.task('default', ['browserSync', 'html', 'css',  'watch', 'fonts']);