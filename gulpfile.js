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
var dev = true;
var reload = browserSync.reload;
var indexUrl = "./index_color.html";
var browsers = ['chrome'];
gulp.task('default', ['css', 'js', 'img', 'serve']);
//gulp.task('default', ['css', 'js', 'img']);


var watcherChangeHandler = function (event) {
    console.log(" ");
    console.log("File " + event.path + " was " + event.type + ", runnings tasks...");
};


/*************************************************/
//
//                    C S S
//
/*************************************************/

gulp.task('css', function () {
    var stream = gulp.src("./dev/css/**/*.less")
        .pipe(less())
        .pipe(autoprefixer('> 1%'));
    if (!dev) {
        stream = stream.pipe(minify());
    }
    return stream.pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest("./public/css/"));
        //.pipe(browserSync.stream());
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
    if (!dev) {
        stream = stream.pipe(uglify());
    }
    return stream.pipe(gulp.dest('./public/js/'));
        //.pipe(browserSync.stream());
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
            index: indexUrl,
            browser: browsers
        }
    });

    gulp.watch("./dev/css/*.less").on('change',reload);
    //gulp.watch("./public/js/global.min.js").on('change', browserSync.reload);
});

gulp.task('css-watch', ['css'], browserSync.reload);