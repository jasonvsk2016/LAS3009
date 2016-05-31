'use strict';

var modRewrite = require('connect-modrewrite'),
    serveStatic = require('serve-static');
var numeral = require('numeral');

module.exports = function(grunt){
  grunt.loadNpmTasks('grunt-contrib-watch');
      grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.initConfig({
    watch: {
      src: {
        files: ['*.html','*.css','*.js'],
        options: {
          livereload:true
        }
      }
    },
    connect: {
      server: {
        options: {
          port:1234,
          base:'.',
          middleware: function(connect, options) {
            var middlewares = [];

            middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]'])); //Matches everything that does not contain a '.' (period)
            options.base.forEach(function(base) {
              middlewares.push(serveStatic(base));
            });
            return middlewares;
          }
        }
      }
    }
  });

  grunt.registerTask('serve', ['connect:server','watch']);
};
