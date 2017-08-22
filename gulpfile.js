var gulp = require("gulp");
var path = require("path");
var concat = require("gulp-concat");
var clean = require('gulp-clean');
var gutil = require("gulp-util");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

var dist = "C:/Users/yhadad/tzofit/";

gulp.task("clean", function () {
    return gulp.src(dist, {read: false})
        .pipe(clean({force: true}));
});

gulp.task("webpack: concat-js", ["clean"], function (callback) {
    var myConfig = Object.create(webpackConfig);
    return webpack(myConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("concat-css", function () {
    return gulp.src("./src/**/*.css")
        .pipe(concat("style.css"))
        .pipe(gulp.dest(dist));
});

gulp.task("copy-lib", function () {
    return gulp.src("./src/lib/**/*.*")
        .pipe(gulp.dest(dist + "lib"));
});

gulp.task("copy-all", function () {
    return gulp.src(["./src/**/*.*", "!./src/**/*.js", "!./src/**/*.css"])
        .pipe(gulp.dest(dist));
});

gulp.task("create", ["clean"], function () {
    gulp.start("webpack: concat-js");
    gulp.start("concat-css");
    // gulp.start("copy-lib");
    gulp.start("copy-all");
});

gulp.task("default", ["clean", "create"]);