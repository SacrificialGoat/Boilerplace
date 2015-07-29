var jasmine = require('jasmine-core');

module.exports = function(karma) {
  karma.set({

    frameworks: ['jasmine', 'browserify'],
    files: ['specs/**/*.js'],
    preprocessors: {
      'specs/**/*.js': [ 'browserify' ]
    },

    browserify: {
      debug: true,
      transform: [ 'reactify' ],
      extensions: ['.js','.jsx']
    },

    browsers: ['Chrome']

  });
}