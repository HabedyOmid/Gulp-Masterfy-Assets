// Gulp file
const gulp         = require('gulp');
const sass         = require('gulp-sass');
const uglify       = require('gulp-uglify');
const concat       = require('gulp-concat');
const cleanCSS     = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const imagemin     = require('gulp-imagemin');
const browserSync  = require('browser-sync').create();


// Paths
var paths = {
    root: {
        root: './',
        node: 'node_modules'
    },
    src: {
        html: 'public_html/**/*.html',
        css:  'public_html/assets/css',
        js:   'public_html/assets/js/**/*.js',
        img:  'public_html/assets/img/**/*.+(png|jpg|gif|svg)',
        scss: 'public_html/assets/scss/**/*.scss',
    },
    dist: {
        css:  'public_html/dist/css',
        js:   'public_html/dist/js',
        img:  'public_html/dist/img'
    }
}


// Compile SCSS
gulp.task('sass', function() {
    return gulp.src(paths.src.scss)

    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.src.css))
    .pipe(browserSync.stream());
});


// Minify + AutoPreFixer + Combine CSS
gulp.task('css', function() {
    return gulp.src(paths.src.css + '/*.css')
    .pipe(autoprefixer({
        browsers: ['last 10 versions'],
        cascade: false
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(concat('app.css'))
    .pipe(gulp.dest(paths.dist.css))
});


// Minify + Combine JS
gulp.task('js', function() {
    return gulp.src(paths.src.js)
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream());
});


// Compress (JPEG, PNG, GIF, SVG)
gulp.task('img', function(){
    return gulp.src(paths.src.img)
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(gulp.dest(paths.dist.img));
});


// Prepare all assets for production
gulp.task('build', gulp.series('sass', 'css', 'js', 'img'));


// Watch (SASS, CSS, JS, and HTML) reload browser on change
gulp.task('watch', function() {
    browserSync.init({
        server: "./public_html/"
    });

    gulp.watch(paths.src.scss, gulp.series('sass'));
    gulp.watch(paths.src.css, gulp.series('css'));
    gulp.watch(paths.src.js, gulp.series('js'));
    gulp.watch(paths.src.html).on('change', browserSync.reload);
});