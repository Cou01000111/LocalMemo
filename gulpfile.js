const gulp = require('gulp');
const typescript = require('gulp-typescript');
const pug = require('gulp-pug');
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync");
const webpackStream = require("webpack-stream");
const webpack = require("webpack");

// webpackの設定ファイルの読み込み
const webpackConfig = require("./webpack.config");

gulp.task('webpack', (done) => {
    // ☆ webpackStreamの第2引数にwebpackを渡す☆
    webpackStream(webpackConfig, webpack)
        .pipe(gulp.dest("docs"));
    done();
});

//setting : paths
var paths = {
    'pug': './src/pug/',
    'html': './docs/',
    'ts': './src/ts/',
    'js': './src/js/'
}
//setting : Pug Options
var pugOptions = {
    pretty: true
}

gulp.task('ts', (done) => {
    var options ={
        "module": "es2015",
    }

    gulp.src([paths.ts + '*.ts'])
        .pipe(typescript(options))
        .pipe(gulp.dest(paths.js));
    done();
});

gulp.task('pug', (done) => {
    gulp.src(paths.pug + '*.pug')
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        .pipe(pug(pugOptions))
        .pipe(gulp.dest(paths.html));
    done();
});

//Browser Sync
gulp.task('browser-sync', (done) => {
    browserSync({
        server: {
            baseDir: paths.html
        }
    });
    gulp.watch('./docs/*.js', gulp.task('reload'));
    gulp.watch(paths.html + "*.html", gulp.task('reload'));
    done();
});

gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});

//watch
gulp.task('watch', function (done) {
    gulp.watch(paths.ts + '*.ts', gulp.task('ts'));
    gulp.watch(paths.pug + '*.pug', gulp.task('pug'));
    gulp.watch(paths.js + '*.js', gulp.task('webpack'));
    done();
});

gulp.task('default', gulp.series('browser-sync', 'watch', (done) => {
    console.log('task default');
    done();
}));
