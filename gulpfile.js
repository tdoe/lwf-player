/**
 * Created by tdoe on 6/7/14.
 */
var gulp = require("gulp");
var tsLint = require("gulp-tslint");
var typescript = require("gulp-tsc");
var uglify = require("gulp-uglify");
var clean = require("gulp-clean");
var rename = require("gulp-rename");
var gutil = require("gulp-util");

var tsLintConf = {
    "rules": {
        "class-name": true,
        "curly": true,
        "eofline": true,
        "forin": true,
        "indent": [true, 4],
        "label-position": true,
        "label-undefined": true,
        "max-line-length": [true, 140],
        "no-arg": true,
        "no-bitwise": true,
        "no-console": [true,
            "debug",
            "info",
            "time",
            "timeEnd",
            "trace"
        ],
        "no-construct": true,
        "no-debugger": true,
        "no-duplicate-key": true,
        "no-duplicate-variable": true,
        "no-empty": true,
        "no-eval": true,
        "no-imports": true,
        "no-string-literal": false,
        "no-trailing-comma": true,
        "no-trailing-whitespace": true,
        "no-unused-variable": false,
        "no-unreachable": true,
        "no-use-before-declare": false,
        "one-line": [true,
            "check-open-brace",
            "check-catch",
            "check-else",
            "check-whitespace"
        ],
        "quotemark": [true, "double"],
        "radix": true,
        "semicolon": true,
        "triple-equals": [true, "allow-null-check"],
        "variable-name": false,
        "whitespace": [true,
            "check-branch",
            "check-decl",
            "check-operator",
            "check-separator"
        ]
    }
};

var SOURCE_TS = "src/**/*.ts";
var DEST_JS_DIR = "js";
var DEST_JS_NAME = "lwf_player.js";


gulp.task("devTsLint", function () {
    gulp.src([SOURCE_TS])
        .pipe(tsLint({
            configuration: tsLintConf
        }))
        .pipe(tsLint.report("verbose", {
            emitError: false
        }));
});

gulp.task("devCompile", function () {
    gulp.src([SOURCE_TS])
        .pipe(typescript({
            target: "ES5",
            module: "commonjs",
            noImplicitAny: true,
            removeComments: true,
            out: DEST_JS_NAME,
            emitError: false
        }))
        .pipe(gulp.dest("sample/js"))
        .on("end", function () {
            gutil.log(("compiled."));
        });
});

gulp.task("tsLint", function () {
    gulp.src([SOURCE_TS])
        .pipe(tsLint({
            configuration: tsLintConf
        }))
        .pipe(tsLint.report("full"));
});

gulp.task("clean", function () {
    return gulp.src(DEST_JS_DIR).pipe(clean());
});

// for release build
gulp.task("build", ["clean", "tsLint"], function (done) {
    gulp.src([SOURCE_TS])
        .pipe(typescript({
            target: "ES5",
            module: "commonjs",
            noImplicitAny: true,
            removeComments: true,
            declaration:true,
            sourcemap: true,
            out: DEST_JS_NAME
        }))
        .pipe(gulp.dest(DEST_JS_DIR))
        .on("end", function () {
            gulp.src("js/lwf_player.js")
                .pipe(uglify())
                .pipe(rename("lwf_player.min.js"))
                .pipe(gulp.dest(DEST_JS_DIR))
                .on("end", done);
        });
});

// for develop
gulp.task("default", function () {
    gulp.watch(SOURCE_TS, ["devTsLint", "devCompile"])
});
