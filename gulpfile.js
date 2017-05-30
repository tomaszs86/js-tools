var gulp = require("gulp"),

  plugins = require('gulp-load-plugins')(),
 
  devBuild = (process.env.NODE_ENV !== 'production')

  folder = {
    src: 'src/',
    build: 'public/'
  }

   inputCss = folder.src + 'less/*.less';
   outputCss = folder.build + 'css';
   inputJs = folder.src + 'js/*.js';
   outputJs = folder.build + 'js';
   inputTs = folder.src + 'typescript/*.ts';
;

gulp.task("css", function () {
  return gulp.src(inputCss)
    .pipe(plugins.less())
    .pipe(plugins.cssmin())
    .pipe(gulp.dest(outputCss));
});

gulp.task('js', function() {

  var jsbuild = gulp.src(inputJs)
    .pipe(plugins.deporder())
    .pipe(plugins.jsvalidate())
    .pipe(plugins.concat('main.js'));

 if (!devBuild) {
    jsbuild = jsbuild
      .pipe(plugins.uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); }))
 }

  return jsbuild.pipe(gulp.dest(folder.build + 'js/'));
});

gulp.task('clean:js', function () {
    return gulp.src(outputJs + '.*', {read: false})
        .pipe(plugins.clean());
});

gulp.task('clean:css', function () {
    return gulp.src(outputCss + '.*', {read: false})
        .pipe(plugins.clean());
});

gulp.task('default', ['clean:js', 'clean:css', 'css', 'js'], function () {
    console.log("success");
});

gulp.task('watch', function() {
  gulp.watch(inputCss, ['css']);
  gulp.watch(inputTs, ['ts']);
});

gulp.task('server', function() {

  gulp.src('public')
    .pipe(plugins.webserver({
      livereload: true,
      fallback: 'index.html',
      directoryListing: {
        enable:true,
        path: 'public/index.html'
      },
      open: true
    }));

});

gulp.task('ts', function() {
    var tsResult = gulp.src(inputTs)
      .pipe(plugins.typescript({
            noImplicitAny: true
        }))
        .pipe(gulp.dest(outputJs));
});

gulp.task('dev', ['watch', 'server', 'ts']);

