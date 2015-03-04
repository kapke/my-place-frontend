'use strict';
var fs = require('fs');

var config = {
	sass: {
		module_dev: {
			options: {
				outputStyle: 'nested',
                sourceComments: true,
                sourceMap: true,
                sourceMapContents: true,
                sourceMapEmbed: true
			},
			files : {}
		},
		module_dist: {
			options: {
				outputStyle: 'compressed'
			},
			files: {}
		}
	},
	concat: {
		module_dev: {
			options: {
				sourceMap: true
			},
			files: {}
		},
		module_dist: {
			options: {},
			files: {}
		}
	}
};

module.exports = function (grunt) {
	var modulePreparer= prepareModule.bind(null, grunt);
	grunt.registerTask('my-place-build-modules', 'MyPlace module builder', function () {
        var options = this.options({
        	modulesDir: __dirname+'/../../../modules',
            modules: '*'
        });
        var modules = getModules(options.modules, options.modulesDir);
        modules.forEach(modulePreparer);
        grunt.config.merge(config);
        grunt.task.run(['sass:module_dev', 'concat:module_dev']);
        grunt.task.run(['sass:module_dist', 'concat:module_dist']);
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
};

function getModules (modules, dir) {
	var list = [];
	if(modules == '*') {
		list = fs.readdirSync(dir);
	}
	return list.map(function (module) {
		return {
			name: module,
			dir: dir+'/'+module
		};
	});
}

function prepareModule (grunt, module) {
	var distDir = module.dir+'/dist';
	config.sass.module_dev.files[distDir+'/style.css'] = module.dir+'/style/style.scss';
	config.sass.module_dist.files[distDir+'/style.min.css'] = module.dir+'/style/style.scss';
	config.concat.module_dev.files[distDir+'/'+module.name+'.js'] = [module.dir+'/src/'+module.name+'.js', module.dir+'/src/**/*.js'];
	config.concat.module_dist.files[distDir+'/'+module.name+'.min.js'] = [module.dir+'/src/'+module.name+'.js', module.dir+'/src/**/*.js'];
}