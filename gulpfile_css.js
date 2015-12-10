'use strict';
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var rename = require('gulp-rename');
var less = require('gulp-less');
var mainTaskName = 'css';

/*************************************************/
//
//                    C S S
//
/*************************************************/


module.exports = function (gulp, getBrowserSyncInstance) {
    return {//TODO add default conf
        init: function (conf) {
            gulp.task(mainTaskName, function () {
                var cssConf = conf;
                var stream;
                stream = gulp.src(cssConf.watchPath);
                stream = cssConf.less ? stream.pipe(less()) : stream;
                stream = cssConf.autoprefix ? stream.pipe(autoprefixer(cssConf.autoprefixString)) : stream;
                stream = cssConf.minify ? stream.pipe(minify()) : stream;
                stream = cssConf.renameToMin ? stream.pipe(rename({extname: '.min.css'})) : stream;
                stream = stream.pipe(gulp.dest(cssConf.destPath));
                stream = conf.streamCss ? stream.pipe(getBrowserSyncInstance().stream()) : stream;
                return stream;
            });
            var cssWatcher = gulp.watch(conf.watchPath, [mainTaskName]);
            //cssWatcher.on('change', watcherChangeHandler);
        },
        getTaskName: function() {
            return mainTaskName;
        }
    }
};