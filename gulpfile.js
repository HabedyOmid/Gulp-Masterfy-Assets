var gulp            = require('gulp');
var sass            = require('gulp-sass');
var uglifyCSS       = require('gulp-uglifycss');
var browserSync     = require('browser-sync').create();
var uglifyJS        = require('gulp-uglyfly');
var concat          = require('gulp-concat');
var autoPreFixer    = require('gulp-autoprefixer');
var imageMin        = require('gulp-imagemin');
var pngQuant        = require('imagemin-pngquant');

// Compile SASS into CSS
gulp.task('sass', function() {
    return gulp.src("./assets/scss/*.scss")
        .pipe(sass())
        .pipe(concat("app.css"))
        .pipe(autoPreFixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('./assets/css/'))
});

// Uglify CSS / Minify CSS 
gulp.task('css', function(){
    gulp.src('./assets/css/*.css')
        .pipe(concat("app-min.css"))
        .pipe(uglifyCSS({
            "uglyComments": true
        }))
        .pipe(gulp.dest('./public_html/'))
        .pipe(browserSync.stream())

});

// Compile and minify multiple JS into a single file
gulp.task('js', function() {
  gulp.src("./assets/js/*.js")
    .pipe(concat("app-min.js"))
    .pipe(uglifyJS())
    .pipe(gulp.dest('./public_html/'))
    .pipe(browserSync.stream());
});

// Minify PNG Files
gulp.task('png', function(){
    return gulp.src('./assets/images/*')
        .pipe(imageMin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngQuant()]
        }))
        .pipe(gulp.dest('./public_html/imgs'));
});

// Static Server + watching SASS, CSS, IMG, JS and HTML files
gulp.task('watch', ['sass', 'css', 'js', 'png'], function() {

    browserSync.init({
        server: "./public_html/"
    });

	gulp.watch('./assets/scss/*.scss', ['sass']);
	gulp.watch('./assets/css/*.css', ['css']);
    gulp.watch('./assets/js/*.js', ['js']);
	gulp.watch('./assets/images/*', ['png']);
	gulp.watch('./public_html/*.html').on('change', browserSync.reload);
});

// Compile SASS, Minify CSS, JS, PNG and Reload page to inject changes
gulp.task('default', ['watch']);



