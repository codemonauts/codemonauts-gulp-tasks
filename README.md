# codemonauts-gulp-tasks
[![npm version](https://badge.fury.io/js/codemonauts-gulp-tasks.svg)](https://badge.fury.io/js/codemonauts-gulp-tasks)

Some common [Gulp](https://gulpjs.com/) functions we share accross all our projects.


## Usage
Install the package **codemonauts-gulp-tasks** with your preferred package manager and then require it at the start of
your `gulpfile.js` like this:

```js
const { clean, script, copy, pug, sass } = require('codemonauts-gulp-functions');
```

### Environment
Some functions behave differently based on your environment which can be set via `--env` when calling Gulp. The default value is `development`. If you provide any other value it will switch to production mode and e.g. activate minifying of the final CSS.


## Included functions
### clean
```
clean('list-of-folders')
```

Example:
```js
task('clean', function () {
    return clean([
        '../templates/*',
        '../public/js/*',
    ]);
});
```

### copy
```
copy('source-folder/list-of-folders/single-file', 'destination-folder')
```

If *destination-folder* has a trailing slash, we assume we should copy the file into this folder. If it doesn't end in a slash, the last part of the path is used as the new filename.


Example:
```js
task('templates', function () {
    return copy("src/static/**", "dist/") && // Copy a whole folder
    copy("src/static/hello.txt", "dist/") && // Copy a single file
    copy("src/static/hello.txt", "dist/renamed.txt") // Copy and rename file
});
```

### pug
```
pug('source-folder', 'destination-folder' [,'amp-css-file'])
```

Example:
```
task('pug', function () {
    return pug('pug/**/*.pug', '../templates')
});
```

Or if you want to inline a special CSS file for AMP, provide the file path via the third parameter:
```
task('pug', function () {
    return pug('pug/**/*.pug', '../templates', '../public/css/amp.css')
});
```

### sass
```
sass('source-folder', 'base-path', 'destination' [, extraPlugins])
```

The list of extraPlugins is optional and can be ommitted. Then you will only get autoprefixer and if building for production also cssnano.

Example:
```js
const tailwindcss = require("tailwindcss");

task("sass", function () {
  extras = [tailwindcss("./tailwind.config.js")];
  return sass("src/sass/**.sass", "src/sass", "website/static/css/", extras);
});
```

### script
```
js('filename', 'destination')
```

Example:
```js
task('js', function () {
    return script('scripts.js');
});
```


With ❤ by [codemonauts](https://codemonauts.com)
