'use strict';
var gulp = require('gulp');

var megaConf = {
    css: {
        active: true,
        streamCss: true,
        watchPath: "./dev/css/**/*.less",
        destPath: "./public/css/",
        renameToMin: true,
        autoprefix: true,
        autoprefixString: '> 1%',
        less: true,
        dev: {//TODO dev
            destPath: "./dev/css/",
            reorderProperties: true
        },
        prod: {//TODO prod
            minify: true,
            destPath: "./public/css/"
        }
    },
    js: {
        active: true,
        streamJs: true,
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
        baseDir: "./",
        indexUrl: "./index_color.html",
        serverPort: 3001,
        browsers: ["google chrome"],
        reloadOnTasks: []
    }
};

var gulpServer = require('./gulpfile_server.js')(gulp);
var gulpCss = require('./gulpfile_css.js')(gulp, gulpServer.getBrowserSyncInstance);
var gulpJs = require('./gulpfile_js.js')(gulp, gulpServer.getBrowserSyncInstance);
var gulpImg = require('./gulpfile_img.js')(gulp);
var tasksToCompleteBeforeBrowser = [];
var tasksThatReloadBrowser = [];
var startupTasks = [];
var tkName;

if (megaConf.css.active) {
    gulpCss.init(megaConf.css);
    tkName = gulpCss.getTaskName();
    tasksToCompleteBeforeBrowser.push(tkName);
    tasksThatReloadBrowser.push(tkName);
    startupTasks.push(tkName);
}
if (megaConf.js.active) {
    gulpJs.init(megaConf.js);
    tkName = gulpJs = gulpJs.getTaskName();
    tasksToCompleteBeforeBrowser.push(tkName);
    tasksThatReloadBrowser.push(tkName);
    startupTasks.push(tkName);
}
if (megaConf.img.active) {
    gulpImg.init(megaConf.img);
    tkName = gulpImg.getTaskName();
    startupTasks.push(tkName);
}
if (megaConf.browerSync.active) {
    gulpServer.init(megaConf.browerSync, tasksToCompleteBeforeBrowser, tasksThatReloadBrowser);
    startupTasks.push(gulpServer.getTaskName());
}

gulp.task('default', startupTasks, function () {

});
