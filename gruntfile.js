module.exports = function(grunt) {
  grunt.initConfig({ 
    pkg: grunt.file.readJSON('package.json'),
 
    uglify: {
      options: {
        banner: '/*\n' +
        ' * ' + 'jQuery Panels - https://github.com/pconnor88/jquery-panels\n' +
        ' * ' + 'Licensed under the MIT license\n' + 
        ' * ' + 'Copyright (c) <%= grunt.template.today("yyyy") %> Pete Connor\n' + 
        ' * ' + 'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n' + 
        ' * ' + 'The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n' + 
        ' * ' + 'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n' + 
        ' */\n'
      },
	
      js: {
        files: {
          'js/jquery.panels.min.js': ['js/jquery.panels.js']
        }
      }
    },
	
	cssmin: {
      options: {
        banner: '/*\n' +
        ' * ' + 'jQuery Panels - https://github.com/pconnor88/jquery-panels\n' +
        ' * ' + 'Licensed under the MIT license\n' + 
        ' * ' + 'Copyright (c) <%= grunt.template.today("yyyy") %> Pete Connor\n' + 
        ' * ' + 'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n' + 
        ' * ' + 'The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n' + 
        ' * ' + 'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n' + 
        ' */\n'
      },
	
      css:{
			src: 'css/jquery.panels.css',
			dest: 'css/jquery.panels.min.css'
		}
    },
	
	watch: {
      files: ['css/jquery.panels.css', 'js/jquery.panels.js'],
      tasks: ['default']
   	}
	
  });
 
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['cssmin:css', 'uglify:js']);

 
}