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
        //js: 'src/js/[^_]*.js',//В стилях и скриптах нам понадобятся только main файлы
        //jshint: 'src/js/*.js',
        css: 'src/css/**/*.css',
        stylus: 'src/stylus/main.css',
        //cssVendor: 'src/css/vendor/*.*', //Если мы хотим файлы библиотек отдельно хранить то раскоментить строчку
        //cssVendor: 'src/css/vendor/*.*', //Если мы хотим файлы библиотек отдельно хранить то раскоментить строчку
        //img: 'src/css/images/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*',
        //contentImg: 'src/img/**/*.*',
        //sprites: 'src/css/sprites/*.png',
        //htaccess: 'src/.htaccess'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        //js: 'src/js/**/*.js',
        css: 'src/css/**/*.*',
        stylus: 'src/stylus/**/*.*',
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
  livereload = require('gulp-livereload'),
  connect = require('gulp-connect'),
  rigger = require('gulp-rigger'),
  debug = require('gulp-debug'),
  del = require('del'),
  plumber = require('gulp-plumber'),
  postcss = require('gulp-postcss');

gulp.task('connect', function() {
  connect.server({
    root: [path.outputDir],
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src(path.src.html)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html)) 
    .pipe(connect.reload())
    .pipe(notify("HTML updated!"));
});

gulp.task('css', function() {
  return gulp.src(path.src.stylus)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(postcss([
      require("postcss-import"),
      require('postcss-cssnext'),
      // require('cssnano')({ autoprefixer: false })
    ]))
    .pipe(sourcemaps.write())
    .pipe(rename({basename: 'style', suffix: '.min'}))
    .pipe(gulp.dest(path.build.css))
    .pipe(connect.reload())
    .pipe(notify("CSS updated!"));
});
  gulp.task('fonts', function() {
    return gulp.src(path.src.fonts)
      .pipe(rename({dirname: ''}))
      .pipe(gulp.dest(path.build.fonts))
  });
gulp.task('clean', function() {
  return del(path.clean);
});

gulp.task('watch', function() {
  gulp.watch(path.watch.stylus, ['css'])
  gulp.watch(path.watch.html, ['html'])
  gulp.watch(path.watch.fonts, ['fonts'])
});

gulp.task('default', ['connect', 'html', 'css', 'watch', 'fonts']);
gulp.task('build', ['html', 'css']);