var deps = require('croc-deps');
var list = require('croc-list');
var path = require('path');
var shelljs = require('shelljs');

exports.link = function(options) {
  var opts = options || {};
  var pkgs = list.packages();
  var order = deps.order({ lenient: opts.lenient });
  
  order.forEach(function(pkgInfo) {
    var pkg = pkgInfo[0];
    var deps = pkgInfo[2];
    var pkgjson = pkgInfo[3];

    var mapping = deps.forEach(function(dep) {
      var dName = dep.split('#')[0];
        var linkPath = path.join(path.dirname(pkgjson), 'node_modules');
        var link = path.join(linkPath, dName);
        var targetPath = path.dirname(pkgs[dName].file);
        shelljs.mkdir('-p', linkPath);
        shelljs.ln('-sf', targetPath, link);
    });
  });
};
