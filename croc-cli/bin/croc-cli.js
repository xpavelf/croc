#!/usr/bin/env node
var doc = ''+
'Usage:                                                                                \n'+
'  croc ls [--json]                                                                    \n'+
'  croc deps [--lenient --json]                                                        \n'+
'  croc ( link [--lenient] | install | test | build )                                  \n'+
'                                                                                      \n'+
'Options:                                                                              \n'+
'  -h --help     Show this screen.                                                     \n'+
'  --version     Show version.                                                         \n'+
'  --json        Show information in JSON format.                                      \n'+
'  --lenient     Ignore that project dependency doesnt satisfies version (semver)      \n';

var docopt = require('docopt').docopt;
var args = docopt(doc, { version : require('../package.json').version });

var list = require('croc-list');
var deps = require('croc-deps');
var link = require('croc-link');
var exec = require('croc-exec');

var table = require('text-table');
var chalk = require('chalk');

var r = new RegExp('\x1b(?:\\[(?:\\d+[ABCDEFGJKSTm]|\\d+;\\d+[Hfm]|' +
        '\\d+;\\d+;\\d+m|6n|s|u|\\?25[lh])|\\w)', 'g');

var _ansiTrim = function(str) { return str.replace(r, ''); };

var _print = function(res) { console.log(res); };

var _printTable = function(tableObj) {
  var tbl = tableObj || {};
  tbl.options.stringLength = function(s) { return _ansiTrim(s).length; };
  var thead_und = tbl.thead.map(function(n) { return chalk.underline(n); });
  var t = table([thead_und].concat(tbl.tbody), tbl.options);
  _print(t); 
};



if (args.ls) {
  var pkgs = list.packages();
  if (args['--json']) {
    _print(pkgs);
  } else {
    _printTable({
      thead: ['Package', 'Version', 'Location'],
      tbody: Object.keys(pkgs).map(function(key) {
        var pkg = pkgs[key];
        return [chalk.yellow(pkg.name), pkg.version, pkg.file];
      }),
      options: { align: ['l', 'r', 'l'] }
    });
  }
  
} else if (args.deps) {
  var order = deps.order({ lenient: args['--lenient'] });
  if (args['--json']) {
    _print(order);  
  } else {
    var depMap = function(dep) {
      var d = dep.split('#'); 
      return d[0] + chalk.gray('#' + d[1]);
    };
    
    _printTable({
      thead: ['Package', 'Version' ,'Depends on'],
      tbody: order.map(function(pkgInfo) { 
        var pkg = pkgInfo[0];
        var ver = pkgInfo[1];
        var depon = pkgInfo[2];
        return [chalk.yellow(pkg), ver, depon.map(depMap)]; 
      }),
      options: { align: ['l', 'r', 'l'] }
    });
  }
  
} else if (args.link) {
  link.link({ lenient: args['--lenient'] });
} else if (args.test) {
  exec.exec({ cmd: 'npm test'});
} else if (args.build) {
  exec.exec({ cmd: 'npm run build' });
} else if (args.install) {
  exec.exec({ cmd: 'npm install' });
}
