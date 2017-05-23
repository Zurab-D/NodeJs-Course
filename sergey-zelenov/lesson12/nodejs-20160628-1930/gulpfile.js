const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const runSequence = require('run-sequence');
const nodemon = require('gulp-nodemon');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.error(err.message, err.stack, err.errors);
  process.exit(255);
});

gulp.task('nodemon', callback => {
  nodemon({
    script:   'index.js',
    ext: 'js, jade'
  });
});

gulp.task('db:load', require('./modules/tasks/dbLoad'));

gulp.on('stop', () => {
  mongoose.disconnect();
});

gulp.on('err', gulpErr => {
  if (gulpErr.err) {
    // cause
    console.error(
      'Gulp error details',
      [gulpErr.err.message, gulpErr.err.stack, gulpErr.err.errors]
        .filter(Boolean)
    );
  }
  mongoose.disconnect();
});
