module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            options: {
                sourceMap: true,
                //footer: '//# sourceMappingURL=./my-place.js.map'
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
        copy: {
            'bower_components/angular-material/angular-material.scss': 'bower_components/angular-material/angular-material.css'
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
    
    grunt.loadNpmTasks('grunt-contrib-concat-sourcemaps');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['copy', 'concat', 'sass:dev', 'sass:dist']);
};