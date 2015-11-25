var deps = require('croc-deps');
var path = require('path');
var shelljs = require('shelljs');

exports.exec = function(options) {
  var opt = options || {};
  var order = deps.order({ latient: true });
  order
    .map(function(pkgInfo){ return path.dirname(pkgInfo[3]); })
    .forEach(function(modulePath) {
      shelljs.cd(modulePath);
      shelljs.exec(options.cmd);
    });
};
