var gulp = require('gulp');

require('@ftbl/gulp')(gulp, { 
  test: { 
    coverage: 80
  , setup: require('./test/setup')
  }
});

gulp.task('default', [ 'test' ]);
