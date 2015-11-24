var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');


var conf = {
    css: {
        active: true,
        watchPath: "./dev/css/**/*.less",
        destPath: "./public/css/",
        renameToMin: true,
        minify: true,
        autoprefix: true,
        autoprefixString: '> 1%',
        less: true
    },
    js: {
        active: true,
        watchPath: "./dev/js/**/*.js",
        destPath: "./public/js/",
        concat: true,
        concatedFilename: 'global.min.js',
        uglify: true
    },
    img: {
        active: true,
        watchPath: "./dev/img/**/*.{png,jpg,jpeg,gif,svg}",
        destPath: "./public/img/"
    },
    browerSync: {
        active: true,
        streamCss: true,
        streamJs: true,
        baseDir: "./",
        indexUrl: "./index_color.html",
        serverPort: 3001,
        browers: ["google chrome"]
    }
};

var watcherChangeHandler = function (event) {
    console.log(" ");
    console.log("File " + event.path + " was " + event.type + ", runnings tasks...");
};

var activeTasksArray = [];
if (conf.css.active) {
    activeTasksArray.push('css');
}
if (conf.js.active) {
    activeTasksArray.push('js');
}
if (conf.img.active) {
    activeTasksArray.push('img');
}
if (conf.browerSync.active) {
    activeTasksArray.push('serve');
}
gulp.task('default', activeTasksArray);

/*************************************************/
//
//                    C S S
//
/*************************************************/

gulp.task('css', function () {
    var cssConf = conf.css;
    if (cssConf.active) {
        var stream;
        stream = gulp.src(cssConf.watchPath);
        stream = cssConf.less ? stream.pipe(less()) : stream;
        stream = cssConf.autoprefix ? stream.pipe(autoprefixer(cssConf.autoprefixString)) : stream;
        stream = cssConf.minify ? stream.pipe(minify()) : stream;
        stream = cssConf.renameToMin ? stream.pipe(rename({extname: '.min.css'})) : stream;
        stream = stream.pipe(gulp.dest(cssConf.destPath));
        stream = conf.browerSync.active && conf.browerSync.streamCss ? stream.pipe(browserSync.stream()) : stream;
        return stream;
    }
});
if (conf.css.active) {
    var cssWatcher = gulp.watch(conf.css.watchPath, ['css']);
    cssWatcher.on('change', watcherChangeHandler);
}


/*************************************************/
//
//                    J S
//
/*************************************************/
gulp.task('js', function () {
    var jsConf = conf.js;
    var stream;
    if (jsConf.active) {
        stream = gulp.src(jsConf.watchPath);
        stream = jsConf.concat ? stream.pipe(concat(jsConf.concatedFilename)) : stream;
        stream = jsConf.uglify ? stream.pipe(uglify()) : stream;
        stream = stream.pipe(gulp.dest(jsConf.destPath));
        stream = conf.browerSync.active && conf.browerSync.streamJs ? stream.pipe(browserSync.stream()) : stream;
        return stream;
    }
});
var jsWatcher = gulp.watch(conf.js.watchPath, ['js']);
if (conf.js.active) {
    jsWatcher.on('change', watcherChangeHandler);
}

/*************************************************/
//
//                    I M G
//
/*************************************************/
gulp.task('img', function () {
    var imgConf = conf.img;
    var stream;
    if (imgConf.active) {
        stream = gulp.src(imgConf.watchPath);
        stream = stream.pipe(imagemin());
        stream = stream.pipe(gulp.dest(imgConf.destPath));
        return stream;
    }
});

var imgWatcher = gulp.watch(conf.img.watchPath, ['img']);
if (conf.img.active) {
    imgWatcher.on('change', watcherChangeHandler);
}

/*************************************************/
//
//                    Browser auto-reload
//
/*************************************************/
gulp.task('serve', ['css'], function () {
    var browserSyncConf = conf.browerSync;
    var stream;
    if (browserSyncConf.active) {
        browserSync.init({
            server: {
                baseDir: browserSyncConf.baseDir,
                index: browserSyncConf.indexUrl
            },
            ui: {
                port: browserSyncConf.serverPort
            },
            ghostMode: {
                clicks: true,
                forms: true,
                scroll: true
            },
            browser: browserSyncConf.browsers
        });
    }
});
if (conf.browerSync.active) {
    gulp.task('css-watch', ['css'], browserSync.reload);
}