module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            options: {
                sourceMap: true
            },
            dev: {
                src: ['src/main.js',
                      'src/*.js', 
                      'src/translate/translate.js', 
                      'src/utils/utils.js', 
                      'src/utils/*.js', 
                      'src/crud/*.js', 
                      'src/translate/*.js', 
                      'src/menu/*.js', 
                      'src/module/*.js'],
                dest: 'dist/my-place.js'
            }
        },
        sass: {
            options: {
                
            },
            dev: {
                options: {
                    outputStyle: 'nested',
                    sourceComments: true,
                    sourceMap: true,
                    sourceMapContents: true,
                    sourceMapEmbed: true
                },
                files: {
                    'dist/style.css': 'style/style.scss'
                }
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    'dist/style.min.css': 'style/style.scss'
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js', 'src/*.js'],
                tasks: ['default']
            },
            styles: {
                files: ['style/*.scss'],
                tasks: ['default']
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['concat', 'sass:dev', 'sass:dist']);
};