'use strict';

var tasks = {};
var tasksNames = [];
/*************************************************/
//
//                    J S
//
/*************************************************/


module.exports = function (gulp, getBrowserSyncInstance) {
    function initJsTask(taskName, taskConf) {
        var uglify = require('gulp-uglify');
        var concat = require('gulp-concat');
        var outStream = gulp.task(taskName, function () {
            var stream;
            if (taskConf.active) {
                stream = gulp.src(taskConf.watchPath);
                stream = taskConf.concat ? stream.pipe(concat(taskConf.renameTo)) : stream;
                stream = taskConf.uglify ? stream.pipe(uglify()) : stream;
                stream = stream.pipe(gulp.dest(taskConf.destPath));
                stream = taskConf.streamJs ? stream.pipe(getBrowserSyncInstance().stream()) : stream;
                return stream;
            }
        });
        tasksNames.push(taskName);
        gulp.watch(taskConf.watchPath, [taskName]);
        return outStream;
    }

    return {
        init: function (conf) {
            for (var key in conf) {
                if (conf.hasOwnProperty(key) && conf[key].active) {
                    tasks[key] = initJsTask("js" + key, conf[key]);
                }
            }
        },
        getTasksNames: function () {
            return tasksNames;
        }
    };
};