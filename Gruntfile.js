module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            options: {
                sourceMap: true
            },
            dist: {
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
        watch: {
            scripts: {
                files: ['src/**/*.js', 'src/*.js'],
                tasks: ['default']
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['concat']);
};