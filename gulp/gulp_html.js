'use strict';
var minify = require('gulp-minify-css');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var tasks = {};
var tasksNames = [];
/*************************************************/
//
//                    H T M L
//
/*************************************************/

var htmlminConf = {
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    conservativeCollapse: false,
    preserveLineBreaks: false,
    collapseBooleanAttributes: false,
    removeAttributeQuotes: false,
    keepClosingSlash: true,
    caseSensitive: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
};

module.exports = function (gulp, getBrowserSyncInstance) {
    function initHTMLTask(taskName, taskConf) {
        var outStream = gulp.task(taskName, function () {
            var stream;
            stream = gulp.src(taskConf.watchPath);
            stream = taskConf.minify ? stream.pipe(htmlmin(htmlminConf)) : stream;
            stream = stream.pipe(gulp.dest(taskConf.destPath));
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
                    tasks[key] = initHTMLTask("html" + key, conf[key]);
                }
            }
        },
        getTasksNames: function () {
            return tasksNames;
        }
    }
};