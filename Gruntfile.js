/**
 * Created by tdoe on 5/4/14.
 */

module.exports = function (grunt) {
    var packages = grunt.file.readJSON('package.json');
    grunt.initConfig({
            watch: {
                files: ['src/*.ts'],
                tasks: ['tslint', 'typescript:dev']
            },
            tslint: {
                options: {
                    configuration: grunt.file.readJSON("conf/tslint.json"),
                    formatter: "prose"
                },
                files: {
                    src: ['src/**/*.ts']
                }
            },
            typescript: {
                base: {
                    src: ['src/**/*.ts'],
                    dest: 'js/lwf_player.js',
                    options: {
                        target: 'es5',
                        basePath: 'src',
                        sourceMap: true,
                        declaration: true
                    }
                },
                dev: {
                    src: ['src/**/*.ts'],
                    dest: 'sample/js/lwf_player.js',
                    options: {
                        target: 'es5'
                    }
                }
            },
            uglify: {
                minify: {
                    files: {
                        "js/lwf_player.min.js": ['js/lwf_player.js']
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

    grunt.registerTask('build', [ 'tslint', 'typescript:base', 'uglify:minify' ]);
    grunt.registerTask('default', [ 'watch' ]);
}
;
