var gulp = require('gulp');

var megaConf = {
    css: {
        active: true,
        watchPath: "./dev/css/**/*.less",
        destPath: "./public/css/",
        renameToMin: true,
        autoprefix: true,
        autoprefixString: '> 1%',
        less: true,
        dev: {//TODO
            destPath: "./dev/css/",
            reorderProperties: true
        },
        prod: {//TODO
            minify: true,
            destPath: "./public/css/"
        }
    },
    js: {
        active: true,
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
        streamCss: true,
        streamJs: true,
        baseDir: "./",
        indexUrl: "./index_color.html",
        serverPort: 3001,
        browsers: ["google chrome"],
        reloadOnTasks: []
    }
};

var gulpCss = require('./gulpfile_css.js')(gulp);
var gulpJs = require('./gulpfile_js.js')(gulp);
var gulpImg = require('./gulpfile_img.js')(gulp);
var gulpServer = require('./gulpfile_server.js')(gulp);

if (megaConf.css.active) {
    gulpCss.init(megaConf.css);
}
if (megaConf.js.active) {
    gulpJs.init(megaConf.js);
}
if (megaConf.img.active) {
    gulpImg.init(megaConf.img);
}
if (megaConf.browerSync.active) {
    gulpServer.init(megaConf.browerSync, [gulpCss.getTaskName()], gulpCss.getTaskName());
}

gulp.task('default', [gulpCss.getTaskName(), gulpJs.getTaskName(), gulpImg.getTaskName(), gulpServer.getTaskName()], function () {

});
