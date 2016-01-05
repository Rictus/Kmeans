'use strict';

var tasksNames = [];
var tasks = {};
/*************************************************/
//
//                    I M G
//
/*************************************************/

module.exports = function (gulp) {
    function initImgTask(taskName, taskConf) {
        var imagemin = require('gulp-imagemin');
        gulp.task(taskName, function () {
            var stream;
            if (taskConf.active) {
                stream = gulp.src(taskConf.watchPath);
                stream = stream.pipe(imagemin());
                stream = stream.pipe(gulp.dest(taskConf.destPath));
                return stream;
            }
        });
        tasksNames.push(taskName);
        gulp.watch(taskConf.watchPath, [taskName]);
    }

    return {
        init: function (conf) {
            for (var key in conf) {
                if (conf.hasOwnProperty(key) && conf[key].active) {
                    tasks[key] = initImgTask("img" + key, conf[key]);
                }
            }
        },
        getTasksNames: function () {
            return tasksNames;
        }
    }
};