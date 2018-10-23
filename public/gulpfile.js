var gulp = require("gulp");

var less = require('gulp-less'), // less
    minifycss = require('gulp-minify-css'), // CSS压缩
    uglify = require('gulp-uglify'), // js压缩
    concat = require('gulp-concat'), // 合并文件
    rename = require('gulp-rename'), // 重命名
    seajsCombo = require('gulp-seajs-combo'),
    clean = require('gulp-clean'); //清空文件夹


gulp.task("stylesheets", function() {
    gulp.src("./css/less/app.less")
        .pipe(less())
        .pipe(rename("app.css"))
        .pipe(gulp.dest("./css/"))
        .pipe(gulp.dest("./build/css/"))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(minifycss())
        .pipe(gulp.dest("./build/css/"));
});

gulp.task('buildlib', function() {
    // gulp.src("./js/init.js")
    //     .pipe(gulp.dest("./build/js/"))
    //     .pipe(uglify())
    //     .pipe(rename({
    //         suffix: ".min"
    //     }))
    //     .pipe(gulp.dest("./build/js/"));

    gulp.src(["./js/lib/zepto.js", "./js/lib/underscore.js", "./js/lib/backbone.js"])
        .pipe(concat("lib.js"))
        .pipe(gulp.dest("./build/js/"))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(uglify())
        .pipe(gulp.dest("./build/js/"));
});

gulp.task('javascripts', function() {

});

gulp.task('img', function() {

});

gulp.task('develop', function() {
    gulp.run('img', 'buildlib', 'stylesheets', 'javascripts');
})

gulp.task("default", function() {
    gulp.run("develop");
    gulp.watch(["./css/less/**"], function() {
        gulp.run("stylesheets");
    });
});