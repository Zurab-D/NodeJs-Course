"use strict";

module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);
  grunt.loadNpmTasks('grunt-lintspaces');

  var config = {
    pkg: grunt.file.readJSON("package.json"),

    lintspaces: {
      codestyle: {
        src: [
          "*.html",
          "**/*.js",
          "!node_modules/**/*.*",
          "less/*.less",
          "sass/*.sass",
          "sass/*.scss"
        ],
        options: {
          editorconfig: ".editorconfig"
        }
      }
    }
  };

  grunt.registerTask("linter", ["lintspaces:codestyle"]);

  grunt.initConfig(config);
};
