const { src, dest, lastRun } = require('gulp');
const $ = require('gulp-load-plugins')();

// Plugins
const autoprefixer = require('autoprefixer');
const browserify = require('browserify');
const buffer = require("vinyl-buffer");
const cssnano = require('cssnano');
const del = require('del');
const fs = require('fs');
const log = require('fancy-log');
const source = require("vinyl-source-stream");
const uglify = require('gulp-uglify-es').default;

// Use Dart to compile sass instead of node-sass
var gulpSass = require('gulp-sass')(require('sass'));


const args = require('minimist')(process.argv.slice(2), {
    string: "env",
    default: { "env": "development" }
})

const isDevelopment = function () {
    return (args.env === 'development');
};
const isProduction = function () {
    return !isDevelopment();
};

// checks if a sass file should be build into its own file or is just a partial
// Returns 'true' for standalone files
// Returns 'false' for includes
const sassFilter = function (file) {
    return !file.path.includes("/_")
};

function pug(source, destination = '../templates', amp = '') {
    let withAMP = false;
    let css = '';
    if (amp != '') {
        css = fs.readFileSync('../public/css/amp.css').toString();
        withAMP = true;

    }
    return src(source, { since: lastRun(pug) })
        .pipe($.pug())
        .pipe($.if(withAMP, $.replace('<!--amp-style-->', `${css}`)))
        .pipe($.rename({
            extname: ".twig"
        }))
        .pipe(dest(destination));
}

function sass(source, idir = '', destination = '../public/css', extraPlugins = []) {
    plugins = extraPlugins.concat([
        autoprefixer(),
        isProduction() ? cssnano() : false,
    ].filter(Boolean));

    return src(source)
        .pipe($.sassInheritance({ dir: idir }))
        .pipe($.filter(sassFilter))
        .pipe($.if(isProduction(), $.sourcemaps.init()))
        .pipe(gulpSass())
        .pipe($.postcss(plugins))
        .pipe($.if(isProduction(), $.sourcemaps.write('./maps')))
        .pipe(dest(destination));
}

function script(scriptpath, destination = '../public/js') {
    return browserify({
        entries: scriptpath,
        debug: isDevelopment()
    })
        .bundle()
        .on('error', err => {
            log.error("Browserify Error: " + err.message);
        })
        .pipe(source(scriptpath.split("/").pop()))
        .pipe($.if(isProduction(), $.sourcemaps.init()))
        .pipe(buffer())
        .pipe($.if(isProduction(), uglify()))
        .pipe($.if(isProduction(), $.sourcemaps.write('./maps')))
        .pipe(dest(destination));
}


function copy(from, to) {
    return src(from)
        .pipe(dest(to))
}

function clean(dirs) {
    log('Clean destination directories.')
    return del(dirs, {
        force: true
    });
}


module.exports = {
    copy: copy,
    pug: pug,
    sass: sass,
    script: script,
    clean: clean,
}
