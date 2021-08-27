const { copy, clean, script, sass } = require("../index.js");
const { task, series, parallel, src, dest } = require("gulp");

task("clean", function () {
  return clean(["dist/js", "dist/css", "dist/*.txt"]);
});

task("sass", function () {
  extras = [];
  return sass("src/sass/**.sass", "src/sass/", "dist/css/", extras);
});

task("script", function () {
  return script("src/js/script.js", "dist/js");
});

task("copy", function () {
  return (
    copy("src/static/**", "dist/") && // Copy a whole folder
    copy("src/static/hello.txt", "dist/") && // Copy a single file
    copy("src/static/hello.txt", "dist/renamed.txt") // Copy and rename file
  );
});

task("default", series("clean", parallel("copy", "script", "sass")));
