const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

/**
 * copy assets to lib folder
 */
gulp.task('copy', ['build'], () => {
    return gulp.src(['./src/**/*', '!./**/*.ts'])
        .pipe(gulp.dest('lib'));
})

/**
 * build typescript
 */
gulp.task('build', ['clean'], () => {
    return tsProject
        .src()
        .pipe(tsProject())
        .pipe(gulp.dest('lib'));
});

/**
 * clean the lib folder
 */
gulp.task('clean', () => {
    return gulp
        .src('lib/')
        .pipe(clean({
            force: true
        }));
});

gulp.task('default', ['copy']);