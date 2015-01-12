var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');

var Tasks = function () {};

gulp.task('browserify', function () {
  	var browserified = transform(function(filename) {
    	var b = browserify(filename);
    	return b.bundle();
  	});
  
  	return gulp.src(['./src/client/*.js'])
    .pipe(browserified)
    //.pipe(uglify())
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('tests', function () {
	require('../../tests/server/test/config-spec.js');
	require('../../tests/server/test/player-collection-spec.js');
	require('../../tests/server/test/player-spec.js');
	require('../../tests/server/test/session-spec.js');
});

Tasks.start = function() {
	gulp.start('browserify');
	gulp.start('tests');
}

module.exports = Tasks;