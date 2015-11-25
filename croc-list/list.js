var shell = require('shelljs');
var path = require('path');
var cwd = process.cwd();

var _ignoreFileName = '.crocignore';
var _getIgnored = function() {
  var ipath = path.join(cwd, _ignoreFileName);
  if (shell.test('-e', ipath)) {
    return shell.cat(ipath).split('\n');
  }
  return [];
};

exports.packages = function() {
  var ignored = _getIgnored();
  var pkgs = shell
    .find(cwd)
    .filter(function(f) { return f.endsWith('package.json'); })
    .filter(function(f) { 
      return ignored.every(function(ifile) { return f.indexOf(ifile) === -1; });
    })
    .reduce(function(sum, f) {
      var info = require(f);
      sum[info.name] = { name: info.name, version: info.version, file: f };
      return sum;
    }, {});
  
  return pkgs;
};

