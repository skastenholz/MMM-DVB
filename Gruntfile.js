module.exports = function(grunt) {
	require("time-grunt")(grunt);
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		jshint: {
			all: ['*.js']
  		},
		csslint: {
			strict: {
				src: ['*.css']
			}
		}
	});
	grunt.loadNpmTasks("grunt-contrib-csslint");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.registerTask("default", ["jshint", "csslint"]);
};
