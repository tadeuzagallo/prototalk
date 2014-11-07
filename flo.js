var exec = require('child_process').exec;
var flo = require('fb-flo');
var fs = require('fs');
var jade = require('jade');
var path = require('path');
var yaml = require('yamljs');

var dir = './src/';
var port = 8888;

var server = flo(dir, {
  port: port,
  glob: ['js/*.js', 'css/*.css', '*.jade', '*.yml']
}, resolver);

function parseYaml(file) {
  var filepath = path.join(dir, file);
  return yaml.load(filepath);
}

function loadConfig() {
  var config = parseYaml('config.yml');
  config.slides = parseYaml('slides.yml');

  return config;
}

var config = loadConfig();

server.once('ready', function () {
  console.log('Server listening on port %s', port);
});

server.on('request', function () {
  console.log(arguments);
});

function resolver(filepath, callback) {
  var ext = path.extname(filepath);

  console.log('Refreshing %s', filepath);

  switch (ext) {
    case '.yml':
      config = loadConfig();
    case '.jade':
      var fp = path.join(dir, 'index.jade');
      var html = jade.renderFile(fp, config);
      fs.writeFileSync(path.join(dir, 'index.html'), html);
      callback({
        resourceURL: fp,
        reload: true,
        contents: html
      });
      break;
    default:
      callback({
        resourceURL: filepath,
        contents: fs.readFileSync(path.join(dir, filepath))
      });
  }
}
