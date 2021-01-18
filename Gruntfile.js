const fonts = [
  'regular', 'outlined', 'round', 'sharp', 'two-tone'
];

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          sourcemap: 'none',
          unixNewlines: true,
          lineNumbers: false,
        },
        files: [
          // // fonts + icons bundle
          // ...fonts.map(font => ({
          //   dest: `css/material-icons-${font}-bundle.css`,
          //   src: [
          //     'scss/material-icons.scss',
          //     `scss/material-icons-${font}.scss`
          //   ]
          // })),
          {
            // only fonts
            ...Object.fromEntries(fonts.map(font => ([
              `css/material-icons-${font}.css`, `scss/material-icons-${font}.scss`
            ]))),
            // // fonts + icons bundle
            // ...Object.fromEntries(fonts.map(font => ([
            //   `css/material-icons-${font}-bundle.css`, [
            //     `scss/material-icons-${font}.scss, scss/material-icons.scss`
            //   ]
            // ]))),
            // only icons
            'css/material-icons-base.css': 'scss/base.scss',
            // all fonts + icons bundle
            'css/material-icons.css': 'scss/bundle.scss'
          }
        ],
      },
      demo: {
        options: {
          sourcemap: 'none',
          unixNewlines: true,
          lineNumbers: true,
        },
        files: {
          'demo/style/main.css': 'demo/style/main.scss'
        }
      },
    },
    cssmin: {
      options: {
        sourceMap: true
      },
      target: {
        files:  [{
          expand: true,
          cwd: 'css',
          src: ['*.css', '!*.min.css'],
          dest: 'css',
          ext: '.min.css'
        }]
      }
    },
    watch: {
      css: {
        files: [
          'scss/*.scss',
          'demo/style/*.scss'
        ],
        tasks: ['sass']
      }
    },
    shell: {
      updateRepo: {
        options: {
          stdout: true
        },
        command: 'python3 scripts/update_repo.py'
      }
    }
  });
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('build', ['shell', 'sass', 'cssmin']);
  grunt.registerTask('default', ['sass', 'watch']);
}
