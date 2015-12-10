'use strict';
var browserSync = require('browser-sync');
var mainTaskName = 'serve';
/*************************************************/
//
//                    Browser auto-reload
//
/*************************************************/
module.exports = function (gulp) {
    return {
        init: function (conf, tasksToCompleteBeforeLoad, tasksThatReload) {
            tasksToCompleteBeforeLoad = tasksToCompleteBeforeLoad && typeof tasksToCompleteBeforeLoad === "object" && tasksToCompleteBeforeLoad.length > 0 ? tasksToCompleteBeforeLoad : [];
            browserSync = browserSync.create();
            gulp.task(mainTaskName, tasksToCompleteBeforeLoad, function () {
                var browserSyncConf = conf;
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
                        browser: browserSyncConf.browsers,
                        reloadDelay: 1000
                    });
                }
            });
            if (tasksThatReload && tasksThatReload.length > 0)
                gulp.task('css-watch',  tasksThatReload, browserSync.reload);
            else
                console.error("Type of 3nd arg is incorrect : ");
        },
        getTaskName: function () {
            return mainTaskName;
        },
        getBrowserSyncInstance: function () {
            return browserSync;
        }
    }
};