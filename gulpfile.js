var gulp = require('gulp');

require('@recipher/gulp')(gulp, { 
  test: { 
    coverage: 80
  , setup: require('./test/setup')
  }
});

gulp.task('default', [ 'test' ]);
