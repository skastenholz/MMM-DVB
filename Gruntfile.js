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
        },
        markdownlint: {
            all: {
                options: {
                    config: {
                        "default": true,
                        "line-length": false
                    }
                },
                src: ["*.md"]
            }
        },
    });
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-csslint");
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks('grunt-cssbeautifier');
    grunt.loadNpmTasks("grunt-markdownlint");
    grunt.registerTask("default", ["jshint", "csslint", "jsbeautifier", "cssbeautifier", "markdownlint"]);
};
