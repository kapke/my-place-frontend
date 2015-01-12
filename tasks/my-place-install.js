var fs = require('fs');

module.exports = function (grunt) {
    grunt.registerTask('my-place-install', 'MyPlace installer', function () {
        var options = this.options({
            sourceDir: __dirname+'/../',
            targetDir: __dirname+'/../../../',
            templatesDirName: 'template',
            translationsDirName: 'translations'
        });
        var dirs = ['templatesDirName', 'translationsDirName'].map(function (item) {
            return {
                source: options.sourceDir + options[item],
                target: options.targetDir + options[item]
            };
        });
        dirs.forEach(function (dir) {
            fs.symlinkSync(dir.source, dir.target); 
            grunt.log.writeln('Created symlink to '+dir.source+' at '+dir.target);
        });
    });
};