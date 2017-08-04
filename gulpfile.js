let debugExport = false;

let gulp = require('gulp');
let gutil = require('gulp-util');
let glob = require('glob');

let _if = require('gulp-if');
let rjs = require('gulp-requirejs');
let uglify = require('gulp-uglify');
let sourcemaps = require('gulp-sourcemaps');

require('gulp-less');
let rimraf = require('gulp-rimraf');
let replace = require('gulp-replace');
let jshint = require('gulp-jshint');

function buildСss() {
    return gulp.src('./assets/*.css')
        .pipe(gulp.dest('./deploy/assets'));
}

gulp.task('css', () => buildСss());

function buildJs() {
    let views = glob.sync('views/**/*.js').map(value => value.replace('.js', ''));

    let locales = glob.sync('locales/**/*.js').map(value => value.replace('.js', ''));

    return rjs({
        baseUrl: './',
        out: 'app.js',
        insertRequire: ['app'],
        paths: {
            locale: 'empty:',
            text: 'libs/text'
        },
        deps: ['app'],
        include: ['libs/almond/almond.js'].concat(views).concat(locales)
    })
        .pipe(_if(debugExport, sourcemaps.init()))
        .pipe(uglify())
        .pipe(_if(debugExport, sourcemaps.write('./')))
        .pipe(gulp.dest('./deploy/'));
}

gulp.task('js', () => buildJs());

gulp.task('clean', () => gulp.src('deploy/*', {read: false}).pipe(rimraf()));

gulp.task('build', ['clean'], () => {
    let build = new Date() * 1;
    let pro = !!gutil.env.pro;

    let streams = [
        buildJs(),
        buildСss(),
        // assets
        gulp.src('./assets/imgs/**/*.*')
            .pipe(gulp.dest('./deploy/assets/imgs/')),
        // index
        gulp.src('./index.html')
            .pipe(replace('data-main="app" src="libs/requirejs/require.js"', 'src="app.js"'))
            .pipe(replace('<script type="text/javascript" src="libs/less.min.js"></script>', ''))
            .pipe(replace(/rel\=\"stylesheet\/less\" href=\"(.*?)\.less\"/g, 'rel="stylesheet" href="$1.css"'))
            .pipe(replace(/\.css\"/g, `.css?${build}"`))
            .pipe(replace(/\.js\"/g, `.js?${build}"`))
            .pipe(replace('require.config', 'webix.production = true; require.config'))
            .pipe(replace(/libs\/webix\/codebase\//g, pro ? 'webix/' : '//cdn.webix.com/edge/'))
            .pipe(replace('/webix_debug.js', '/webix.js'))
            .pipe(gulp.dest('./deploy/')),
        // server
        gulp.src(['./server/**/*.*',
            '!./server/*.log', '!./server/config.*',
            '!./server/dev/**/*.*', '!./server/dump/**/*.*'])
            .pipe(gulp.dest('./deploy/server/'))
    ];

    if (pro) { streams.push(gulp.src('libs/webix/codebase/**/*.*').pipe(gulp.dest('./deploy/webix/'))); }

    return require('event-stream').merge(streams);
});

gulp.task('lint', () => gulp.src(['./views/**/*.js', './helpers/**/*.js', './models/**/*.js', './*.js', '!./jshint.conf.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail')));
