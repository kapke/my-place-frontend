module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            options: {
                sourceMap: true
            },
            dist: {
                src: ['app/main.js',
                      'app/*.js', 
                      'app/translate/translate.js', 
                      'app/utils/utils.js', 
                      'app/utils/*.js', 
                      'app/crud/*.js', 
                      'app/translate/*.js', 
                      'app/menu/*.js', 
                      'app/module/*.js'],
                dest: 'dist/my-place.js'
            }
        },
        watch: {
            scripts: {
                files: ['app/**/*.js', 'app/*.js'],
                tasks: ['default']
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['concat']);
};