 // Gulp file
var gulp         = require('gulp');
var wait         = require('gulp-wait');
var sass         = require('gulp-sass');
var postcss      = require('gulp-postcss');
var csscomb      = require('gulp-csscomb');
var cleanCSS     = require('gulp-clean-css');
var rename       = require('gulp-rename');
var del          = require('del');
var uglify       = require('gulp-uglify');
var runSequence  = require('run-sequence');
var imageMin     = require('gulp-imagemin');
var pngQuant     = require('imagemin-pngquant');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync').create();

// Define paths
var paths = {
    dist: {
        root: 'public_html/dist',
        img:  'public_html/dist/img',
        libs: 'public_html/dist/vendor'
    },
    root: {
        root: './',
        node: 'node_modules'
    },
    src: {
        root: './',
        css:  'assets/css',
        img:  'assets/img/**/*.+(png|jpg|gif|svg)',
        html: '**/*.html',
        js:   'assets/js/**/*.js',
        scss: 'assets/scss/**/*.scss',
        libs: 'assets/vendor/**/*.+(css|js)',
    }
}

// Compile SCSS
gulp.task('sass', function() {
    return gulp.src(paths.src.scss)

    .pipe(wait(500))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([require('postcss-flexbugs-fixes')]))
    .pipe(autoprefixer({
        browsers: ['> 1%']
    }))

    .pipe(csscomb())
    .pipe(gulp.dest(paths.src.css))
    .pipe(browserSync.reload({
        stream: true
    }))
});

// Minify CSS
gulp.task('css', function() {
    return gulp.src([
        paths.src.css + '/app.css'
    ])

    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist.root + '/css'))
});

// Minify JS
gulp.task('js', function() {
    return gulp.src([
        paths.src.root + '/assets/js/*.js'
    ])
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist.root + '/js'))
});

// Compress Images(PNG) + Move to DIST
gulp.task('img', function(){
    return gulp.src(paths.src.img)
        .pipe(imageMin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngQuant()]
        }))
        .pipe(gulp.dest(paths.dist.img));
});

// Move vendor libraries to Dist
gulp.task('libs', function(){
    return gulp.src(paths.src.libs)
        .pipe(gulp.dest(paths.dist.libs));
});

// Clean
gulp.task('clean', function() {
    return del.sync(paths.dist.root);
});

// Live reload
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
             baseDir: "./public_html/"
        },
    })
});

// Watch for SASS/CSS/JS/HTML Changes
gulp.task('watch', ['sass'], function() {

    browserSync.init({
        server: "./public_html/"
    });

    gulp.watch(paths.src.scss, ['sass']);
    gulp.watch(paths.src.css + '/*.css', ['css']);
    gulp.watch(paths.src.css + '/*.css', browserSync.reload);
    gulp.watch(paths.src.root + '/assets/js/*.js', ['js']);
    gulp.watch(paths.src.js, browserSync.reload);
    gulp.watch(paths.src.html, browserSync.reload);
});

// Build -> Clean Dist + Compile SASS + Copy CSS + Copy JS + Compress Imgs + Copy vendors
gulp.task('build', function(callback) {
    runSequence('clean', 'sass', 'css', 'js', 'img', 'libs',
        callback);
});

// Default = Watch
gulp.task('default', ['watch']);