var fs = require("fs"),
    del = require("del"),
    glob = require("glob"),
    path = require("path"),
    gulp = require("gulp"),
    exec = require("child_process").exec,
    inject = require("gulp-inject"),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence');

gulp.task("clear", () => {
    return del(["./dist/**/*"]);
});

gulp.task("compile", (done) => {
    exec("tsc -p src", (error, stdout, stderr) => {
        console.log(stdout);
        done();
    });
});

gulp.task("build", (done) => {
    runSequence("clear", "compile", done);
});

gulp.task("watch", () => {
    return gulp.watch("./src/**/*.ts", ["compile"]);
});

gulp.task("createSpecRunner", () => {
    gulp.src("./SpecRunner.html")
        .pipe(inject(gulp.src(["./dist/**/*.spec.js"], { read: false }), {
            starttag: "Promise.all([",
            endtag: "]);",
            transform: function (filepath, file, index, length) {
                return `System.import('${filepath}')` + (index < length - 1 ? "," : "");
            }
        }))
        .pipe(gulp.dest('./'));;
});

gulp.task("launchBrowserSync", () => {
    var options = {
        port: 3000,
        server: './',
        files: ['./dist/**/*.js',
            './dist/**/*.spec.js',
            '!./dist/**/*.js.map'],
        logFileChanges: true,
        logLevel: 'info',
        logPrefix: 'spec-runner',
        notify: true,
        reloadDelay: 1000,
        startPath: 'SpecRunner.html'
    };

    browserSync(options);
});

gulp.task("test", (done) => {
    runSequence("build", "watch", "createSpecRunner", "launchBrowserSync", done);
});