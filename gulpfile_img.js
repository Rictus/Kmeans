'use strict';
var imagemin = require('gulp-imagemin');
var mainTaskName = 'img';
/*************************************************/
//
//                    I M G
//
/*************************************************/

module.exports = function (gulp) {
    return {
        init: function (conf) {
            gulp.task(mainTaskName, function () {
                var imgConf = conf;
                var stream;
                if (imgConf.active) {
                    stream = gulp.src(imgConf.watchPath);
                    stream = stream.pipe(imagemin());
                    stream = stream.pipe(gulp.dest(imgConf.destPath));
                    return stream;
                }
            });

            var imgWatcher = gulp.watch(conf.watchPath, [mainTaskName]);
            //imgWatcher.on('change', function (e) {});
        },
        getTaskName: function () {
            return mainTaskName;
        }
    }
};