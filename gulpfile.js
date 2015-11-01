var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var path = require('path');
var imagemin = require('gulp-imagemin');


var conf = {
    indexUrl: "./index_color.html",
    minify: true,
    browsers: ["google chrome"]
};


var watcherChangeHandler = function (event) {
    console.log(" ");
    console.log("File " + event.path + " was " + event.type + ", runnings tasks...");
};

//gulp.task('default', ['css', 'js', 'img', 'serve']);
gulp.task('default', ['css', 'js', 'img']);

/*************************************************/
//
//                    C S S
//
/*************************************************/

gulp.task('css', function () {
    var stream = gulp.src("./dev/css/**/*.less")
        .pipe(less())
        .pipe(autoprefixer('> 1%'));
    if (conf.minify) {
        stream = stream.pipe(minify());
    }
    return stream.pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest("./public/css/"))
        .pipe(browserSync.stream());
});

var lessWatcher = gulp.watch("./dev/css/**/*.less", ['css']);
lessWatcher.on('change', watcherChangeHandler);


/*************************************************/
//
//                    J S
//
/*************************************************/
gulp.task('js', function () {
    var stream = gulp.src('./dev/js/**/*.js')
        .pipe(concat('global.min.js'));
    if (conf.minify) {
        stream = stream.pipe(uglify());
    }
    return stream.pipe(gulp.dest('./public/js/'))
        .pipe(browserSync.stream());
});


var jsWatcher = gulp.watch("./dev/js/**/*.js", ['js']);
jsWatcher.on('change', watcherChangeHandler);

/*************************************************/
//
//                    I M G
//
/*************************************************/
gulp.task('img', function () {
    return gulp.src('./dev/img/**/*.{png,jpg,jpeg,gif,svg}')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img/'));
});

var imgWatcher = gulp.watch("./dev/img/**/*.{png,jpg,jpeg,gif,svg}", ['img']);
imgWatcher.on('change', watcherChangeHandler);

/*************************************************/
//
//                    Browser auto-reload
//
/*************************************************/
gulp.task('serve', ['css'], function () {
    browserSync.init({
        server: {
            baseDir: "./",
            index: conf.indexUrl
        },
        ui: {
            port: 3001
        },
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
        },
        browser: conf.browsers
    });
});

gulp.task('css-watch', ['css'], browserSync.reload);