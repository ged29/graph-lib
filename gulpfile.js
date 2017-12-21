var fs = require("fs"),
    del = require("del"),
    glob = require("glob"),
    path = require("path"),
    gulp = require("gulp"),
    exec = require("child_process").exec,
    inject = require("gulp-inject"),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence'),

    ts = require("gulp-typescript"),
    srcMap = require("gulp-sourcemaps"),
    tsProject = ts.createProject("./tsconfig.json", {
        typescript: require("typescript")
    });

gulp.task("tsc", () => {
    return gulp.src(["src/**/*.ts", "node_modules/@types/**/*.d.ts"])
        .pipe(srcMap.init({ loadMaps: true }))
        .pipe(tsProject())
        .js
        .pipe(srcMap.write(".", { includeContent: false }))
        .pipe(gulp.dest("dist"));
});

gulp.task("clear", () => {
    return del(["./dist/**/*"]);
});

gulp.task("build", (done) => {
    runSequence("clear", "tsc", done);
});

gulp.task("watch", ["build"], () => {
    return gulp.watch("./src/**/*.ts", ["tsc"]);
});

gulp.task("createSpecRunner", () => {
    return gulp.src("./SpecRunner.html")
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
        files: ['./dist/**/*.js', './dist/**/*.spec.js'],
        logFileChanges: true,
        logLevel: 'info',
        logPrefix: 'spec-runner',
        notify: true,
        ghostMode: false,
        reloadDelay: 1000,
        reloadDebounce: 1000,
        injectChanges: false,
        minify: false,
        startPath: 'SpecRunner.html'
    };

    browserSync(options);
});

gulp.task("test", (done) => {
    runSequence("watch", "createSpecRunner", "launchBrowserSync", done);
});