var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var cwd = process.cwd();

var _ignoreFileName = '.crocignore';
var _getIgnored = function() {
  var ipath = path.join(cwd, _ignoreFileName);
  if (shell.test('-e', ipath)) {
    return shell.cat(ipath)
      .split('\n')
      .filter(function(str) { return str.trim() !== ''; });
  }
  return [];
};

exports.packages = function () {
  var ignored = _getIgnored();
	var projects = [];
	var _tree = function (dir) {
		try {
			var stats = fs.statSync(dir);
			if (stats.isFile() && path.basename(dir) === 'package.json') {
				projects.push(dir);
			} else if (stats.isDirectory()) {
        var visit = ignored.every(function(name) { return dir.indexOf(name) === -1; });
        if(visit) {
				  fs.readdirSync(dir).map(function (child) {
            _tree(path.join(dir, child));
          });
        }
			}
		} catch (e) {
			return;
		}
	};
	_tree(cwd);
	return projects.reduce(function(sum, f) {
    var info = require(f);
    sum[info.name] = { name: info.name, version: info.version, file: f };
    return sum;
  }, {});
};
