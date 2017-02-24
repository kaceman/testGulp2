var gulp = require('gulp');

var sass = require('gulp-sass');

var browserSync = require('browser-sync').create();

var useref = require('gulp-useref');

var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');

var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

var del = require('del');

var runSequence = require('run-sequence');

gulp.task('sass', function () {
    return gulp.src('app/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('app/scss/**/*.scss', ['sass']);

    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/*.js', browserSync.reload);
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

// Cette tâche permet de concaténer les script JS or CSS
// <!--build:js js/main.min.js -->
// Something here
// <!-- endbuild -->
// <!--build:css css/styles.min.css-->
// Something here
// <!-- endbuild -->
gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

// Pour minifier js Or css
gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        // minifier si c'est du js
        .pipe(gulpIf('*.js', uglify()))
        // minifier si c'est du css
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

// Pour minifier les images (png, jpg, gif, svg)
gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

// copier les fonts
gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

// suppression des fichiers non-utiles
gulp.task('clean:dist', function () {
    return del.sync('dist');
});

gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
});

// gulp.task('build', ['clean:dist', 'sass', 'useref', 'images', 'fonts'], function () {
//     console.log('Building files');
// });

gulp.task('build', function (callback) {
    runSequence('clean:dist', [
        'sass',
        'useref',
        'images',
        'fonts'
    ], callback)
});

gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'], callback)
});