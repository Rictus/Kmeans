'use strict';
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var rename = require('gulp-rename');
var less = require('gulp-less');
var tasks = {};
var tasksNames = [];
/*************************************************/
//
//                    C S S
//
/*************************************************/


module.exports = function (gulp, getBrowserSyncInstance) {
    function initCssTask(taskName, taskConf) {
        var outStream = gulp.task(taskName, function () {
            var stream;
            stream = gulp.src(taskConf.watchPath);
            stream = taskConf.less ? stream.pipe(less()) : stream;
            stream = taskConf.autoprefix ? stream.pipe(autoprefixer(taskConf.autoprefixString)) : stream;
            stream = taskConf.minify ? stream.pipe(minify()) : stream;
            stream = taskConf.renameToMin ? stream.pipe(rename({extname: '.min.css'})) : stream;
            stream = stream.pipe(gulp.dest(taskConf.destPath));
            stream = taskConf.streamCss ? stream.pipe(getBrowserSyncInstance().stream()) : stream;
            return stream;
        });
        tasksNames.push(taskName);
        gulp.watch(taskConf.watchPath, [taskName]);
        return outStream;
    }

    return {
        init: function (conf) {
            for (var key in conf) {
                if (conf.hasOwnProperty(key) && conf[key].active) {
                    tasks[key] = initCssTask("css" + key, conf[key]);
                }
            }
        },
        getTasksNames: function () {
            return tasksNames;
        }
    }
};