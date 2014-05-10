/**
 * Created by tdoe on 5/4/14.
 */

module.exports = function (grunt) {
    var packages = grunt.file.readJSON("package.json");
    grunt.initConfig({
            watch: {
                files: ["src/*.ts"],
                tasks: ["tslint", "typescript:dev"]
            },
            tslint: {
                options: {
                    configuration: grunt.file.readJSON("conf/tslint.json"),
                    formatter: "prose"
                },
                files: {
                    src: ["src/**/*.ts"]
                }
            },
            typescript: {
                base: {
                    src: ["src/**/*.ts"],
                    dest: "js/lwf_player.js",
                    options: {
                        target: "es5",
                        basePath: "src",
                        sourceMap: true,
                        declaration: true
                    }
                },
                dev: {
                    src: ["src/**/*.ts"],
                    dest: "sample/js/lwf_player.js",
                    options: {
                        target: "es5"
                    }
                }
            },
            uglify: {
                minify: {
                    files: {
                        "js/lwf_player.min.js": ["js/lwf_player.js"]
                    }
                }
            },
            jasmine: {
                all: {
                    src: "js/lwf_player.js",
                    options: {
                        specs: "spec/*Spec.js",
                        vendor: [
                            "sample/js/lwf.js"
                        ],
                        keepRunner: true,
                        outfile: "build/SpecRunner.html",
                        helpers: 'spec/helper/helper.js'
                    }
                },
                iOS: {
                    src: "js/lwf_player.js",
                    options: {
                        specs: "spec/lwfUtil/iOS_lwfUtilSpec.js",
                        vendor: [
                            "sample/js/lwf.js"
                        ],
                        keepRunner: true,
                        outfile: "build/iOS_SpecRunner.html",
                        helpers: 'spec/helper/iOSHelper.js'
                    }
                },
                Android: {
                    src: "js/lwf_player.js",
                    options: {
                        specs: "spec/lwfUtil/android_lwfUtilSpec.js",
                        vendor: [
                            "sample/js/lwf.js"
                        ],
                        keepRunner: true,
                        outfile: "build/android_SpecRunner.html",
                        helpers: 'spec/helper/androidHelper.js'
                    }
                }
            }
        }
    );

    for (var taskName in packages.devDependencies) {
        if (packages.devDependencies.hasOwnProperty(taskName) && /^grunt-/.test(taskName)) {
            grunt.loadNpmTasks(taskName);
        }
    }

    grunt.registerTask("default", [ "watch" ]);
    grunt.registerTask("build", [ "tslint", "typescript:base", "jasmine", "uglify:minify" ]);

    grunt.registerTask("test", [ "typescript:base", "jasmine"]);
    grunt.registerTask("iOS_test", [ "typescript:base", "jasmine:iOS" ]);
    grunt.registerTask("Android_test", [ "typescript:base", "jasmine:Android" ]);
}
;
