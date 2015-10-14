var less = require('gulp-less');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var path = require('path');

var dev = false;

gulp.task('default', function () {
});


var watcherChangeHandler = function (event) {
    console.log(" ");
    console.log("File " + event.path + " was " + event.type + ", runnings tasks...");
};

/*************************************************/
//
//                    C S S
//
/*************************************************/

gulp.task('lessProd', function () {
    return gulp.src("./dev/css/**/*.less")
        .pipe(less())
        .pipe(autoprefixer('> 1%'))
        .pipe(minify())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest("./public/css/"));
});

var lessWatcher = gulp.watch("./dev/css/**/*.less", ['lessProd']);
lessWatcher.on('change', watcherChangeHandler);


/*************************************************/
//
//                    J S
//
/*************************************************/
gulp.task('js', function () {
    var calls = gulp.src('./dev/js/**/*.js')
        .pipe(concat('global.min.js'));
    if (!dev) {
        calls = calls.pipe(uglify());
    }
    calls.pipe(gulp.dest('./public/js/'));
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
        .pipe(gulp.dest(prod + '/public/img/'));
});
var imgWatcher = gulp.watch("./dev/img/**/*.{png,jpg,jpeg,gif,svg}", ['img']);
imgWatcher.on('change', watcherChangeHandler);
