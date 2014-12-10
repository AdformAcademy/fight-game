var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');

function Tasks() {
};

gulp.task('browserify', function () {
  	var browserified = transform(function(filename) {
    	var b = browserify(filename);
    	return b.bundle();
  	});
  
  	return gulp.src(['./src/client/*.js'])
    .pipe(browserified)
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));
});

Tasks.start = function() {
	gulp.start('browserify');
}

module.exports = Tasks;