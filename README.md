# codemonauts-gulp-tasks

Some common functions we share accross all our CraftCMS projects


## Example usage

```js
const { task, series, parallel } = require('gulp');
const { clean, script, copy } = require('codemonauts-gulp-functions');

task('js', function () {
    return script('scripts.js');
});

task('templates', function () {
    return copy(['twig/*.twig', 'twig/*.xml'], '../templates');
});

task('clean', function () {
    return clean([
        '../templates/*',
        '../public/js/*',
    ]);
});

task('build', series('clean', parallel('js', 'templates'));
```
