module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            options: {
                sourceMap: true
            },
            dist: {
                src: ['app/main.js', 'app/utils/utils.js', 'app/**/*.js', 'app/*.js'],
                dest: 'dist/my-place.js'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    grunt.registerTask('default', ['concat']);
};