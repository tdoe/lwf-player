/**
 * Created by tdoe on 5/4/14.
 */

module.exports = function (grunt) {
    var packages = grunt.file.readJSON("package.json");
    grunt.initConfig({
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

    grunt.registerTask("test", ["jasmine"]);
    grunt.registerTask("iOS_test", ["jasmine:iOS"]);
    grunt.registerTask("Android_test", ["jasmine:Android"]);
}
;
