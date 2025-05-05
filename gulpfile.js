const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const beautify = require('gulp-cssbeautify');

async function loadAutoprefixer() {
    const autoprefixer = (await import('gulp-autoprefixer')).default;
    return autoprefixer;
}

async function style() {
    const autoprefixer = await loadAutoprefixer();
    return gulp.src('./scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(beautify())
        .pipe(gulp.dest('./assets/css')) 
        .pipe(browserSync.stream());
}

function minifyCSS() {
    return gulp.src('./css/**/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('./dist/css'));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./scss/**/*.scss', style); 
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch('./js/**/*.js').on('change', browserSync.reload);
}

exports.scss = style;
exports.minifyCSS = minifyCSS;
exports.watch = watch;