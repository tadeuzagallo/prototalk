var flo = require('fb-flo');
var path = require('path');
var fs = require('fs');
var jade = require('jade');
var exec = require('child_process').exec;

var dir = './src/';
var port = 8888;

var server = flo(dir, {
  port: port,
  glob: ['js/*.js', 'css/*.css', '*.jade']
}, resolver);

server.once('ready', function () {
  console.log('Server listening on port %s', port);
});

server.on('request', function () {
  console.log(arguments);
});

function resolver(filepath, callback) {
  var ext = path.extname(filepath);
  var absPath = path.join(dir, filepath);
  var url;
  var contents;

  console.log(filepath);
  if (ext === '.jade') {
    exec('jade ' + absPath, function (err) {
      if (err) {
        console.log(err);
      } else {
        var fp = filepath.replace('.jade', '.html');
        callback({
          resourceURL: fp,
          reload: true,
          contents: fs.readFileSync(path.join(dir, fp))
        });
      }
    });
  } else {
    callback({
      resourceURL: filepath,
      contents: fs.readFileSync(path.join(dir, filepath))
    });
  }

}
