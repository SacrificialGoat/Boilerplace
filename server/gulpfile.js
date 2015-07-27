var gulp = require('gulp');


/*
 * Build application server.
 */
gulp.task('server:build', function() {
  return child.spawnSync('go', ['install']);
});


/*
 * Restart application server.
 */
gulp.task('server:spawn', function() {
  if (server)
    server.kill();

  /* Spawn application server */
  server = child.spawn('server');

  /* Trigger reload upon server start */
  server.stdout.once('data', function() {
    reload.reload('/');
  });

  /* Pretty print server log output */
  server.stdout.on('data', function(data) {
    var lines = data.toString().split('\n')
    for (var l in lines)
      if (lines[l].length)
        util.log(lines[l]);
  });

  /* Print errors to stdout */
  server.stderr.on('data', function(data) {
    process.stdout.write(data.toString());
  });
});


/*
 * Watch source for changes and restart application server.
 */
gulp.task('server:watch', function() {

  /* Restart application server */
  gulp.watch([
    '.views/**/*.tmpl',
    'config/*.json',
    'locales/*.json'
  ], ['server:spawn']);

  /* Rebuild and restart application server */
  gulp.watch([
    '*/**/*.go',
  ], sync([
    'server:build',
    'server:spawn'
  ], 'server'));
});