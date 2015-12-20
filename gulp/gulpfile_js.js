'use strict';
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var mainTaskName = 'js';
/*************************************************/
//
//                    J S
//
/*************************************************/


module.exports = function (gulp, getBrowserSyncInstance) {
    return {//TODO add default conf
        init: function (conf) {
            gulp.task(mainTaskName, function () {
                var jsConf = conf;
                var stream;
                if (jsConf.active) {
                    stream = gulp.src(jsConf.watchPath);
                    stream = jsConf.concat ? stream.pipe(concat(jsConf.concatedFilename)) : stream;
                    stream = jsConf.uglify ? stream.pipe(uglify()) : stream;
                    stream = stream.pipe(gulp.dest(jsConf.destPath));
                    stream = jsConf.streamJs ? stream.pipe(getBrowserSyncInstance().stream()) : stream;
                    return stream;
                }
            });
            var jsWatcher = gulp.watch(conf.watchPath, [mainTaskName]);
            //jsWatcher.on('change', watcherChangeHandler);
        },
        getTaskName: function() {
            return mainTaskName;
        }
    };
};