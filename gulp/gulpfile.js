'use strict';
var gulp = require('gulp');

var gulpServer = require('./gulpfile_server.js')(gulp);
var gulpCss = require('./gulpfile_css.js')(gulp, gulpServer.getBrowserSyncInstance);
var gulpHtml = require('./gulp_html.js')(gulp, gulpServer.getBrowserSyncInstance);
var gulpJs = require('./gulpfile_js.js')(gulp, gulpServer.getBrowserSyncInstance);
var gulpImg = require('./gulpfile_img.js')(gulp);
var tasksToCompleteBeforeBrowser = [];
var tasksThatReloadBrowser = [];
var startupTasks = [];
var tksNames;
var megaConf = {
    css: {
        module: gulpCss,
        dev: {
            active: true,
            streamCss: true,
            watchPath: "../dev/css/**/*.less",
            destPath: "../dev-public/css/",
            renameToMin: true,
            autoprefix: true,
            autoprefixString: '> 1%',
            less: true,
            minify: false
        },
        prod: {
            active: true,
            streamCss: false,
            watchPath: "../dev/css/**/*.less",
            destPath: "../prod/css/",
            renameToMin: true,
            autoprefix: true,
            autoprefixString: '> 1%',
            less: true,
            minify: true
        }
    },
    js: {
        module: gulpJs,
        dev: {
            active: true,
            streamJs: true,
            watchPath: "../dev/js/**/*.js",
            destPath: "../dev-public/js/",
            concat: true,
            concatedFilename: 'global.min.js',
            uglify: false
        },
        prod: {
            active: true,
            streamJs: false,
            watchPath: "../dev/js/**/*.js",
            destPath: "../prod/js/",
            concat: true,
            concatedFilename: 'global.min.js',
            uglify: true
        }
    },
    img: {
        module: gulpImg,
        dev: {
            active: true,
            watchPath: "../dev/img/**/*.{png,jpg,jpeg,gif,svg}",
            destPath: "../dev-public/img/"
        },
        prod: {
            active: true,
            watchPath: "../dev/img/**/*.{png,jpg,jpeg,gif,svg}",
            destPath: "../prod/img/"
        }
    },
    html: {
        module: gulpHtml,
        dev: {
            active: true,
            watchPath: "../dev/*.html",
            destPath: "../dev-public/",
            minify: false
        },
        prod: {
            active: true,
            watchPath: "../dev/*.html",
            destPath: "../prod/",
            minify: true
        }
    }
};

var browerSync = {
    active: true,
    baseDir: "../prod/",
    indexUrl: "index_color.html",
    serverPort: 3001,
    browsers: ["google chrome"],
    reloadOnTasks: []
};


///loop through confs

for (var key in megaConf) {
    if (megaConf.hasOwnProperty(key)) {
        var responsibleModule = megaConf[key].module;
        responsibleModule.init(megaConf[key]);
        tksNames = responsibleModule.getTasksNames();
        tasksToCompleteBeforeBrowser = tasksToCompleteBeforeBrowser.concat(tksNames);
        tasksThatReloadBrowser = tasksThatReloadBrowser.concat(tksNames);
        startupTasks = startupTasks.concat(tksNames);
    }
}

if (browerSync.active) {
    gulpServer.init(browerSync, tasksToCompleteBeforeBrowser, tasksThatReloadBrowser);
    startupTasks.push(gulpServer.getTasksNames());
}

gulp.task('default', startupTasks, function () {
    console.log(startupTasks);
});
