var gulp        = require('gulp');
var sass        = require('gulp-sass');
var uglifyCSS   = require('gulp-uglifycss');
var browserSync = require('browser-sync').create();
var uglifyJS    = require('gulp-uglyfly');
var concat 	    = require('gulp-concat');



// Compile SASS
gulp.task('sass', function() {
    return gulp.src("./assets/sass/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./assets/css/"))
        .pipe(browserSync.stream());
});


// Uglify CSS
gulp.task('uglifyCSS', function(){
    gulp.src('./assets/css/*.css')
        .pipe(concat("app.css"))
        .pipe(uglifyCSS({
            "uglyComments": true
        }))
        .pipe(gulp.dest('./public_html/'));
});


// Compile Multiple JS into single minified file
gulp.task('uglifyJS', function() {
  gulp.src("./assets/js/*.js")
    .pipe(concat("app.js"))
    .pipe(uglifyJS())
    .pipe(gulp.dest('./public_html/'));
});


// Static Server + watching scss/html files
gulp.task('run', ['sass', 'uglifyCSS', 'uglifyJS'], function() {

    browserSync.init({
        server: "./public_html/"
    });

	gulp.watch('./assets/sass/*.scss', ['sass']);
	gulp.watch('./assets/css/*.css', ['uglifyCSS']);
	gulp.watch('./assets/js/*.js', ['uglifyJS']);
	gulp.watch('./public_html/*.html').on('change', browserSync.reload);
});


// Compile SASS, Minify CSS and Reload page to inject changes "npm start" command
gulp.task('default', ['run']);



