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
        },
        jsbeautifier: {
            files: ["*.js"],
            options: {}
        },
        cssbeautifier: {
            files: ["*.css"]
        }
    });
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-csslint");
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks('grunt-cssbeautifier');
    grunt.registerTask("default", ["jshint", "csslint", "jsbeautifier", "cssbeautifier"]);
};
