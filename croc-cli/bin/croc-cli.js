#!/usr/bin/env node
var doc = '' +
  'Usage:                                                                                \n' +
  '  croc ls [--json]                                                                    \n' +
  '  croc deps [--lenient --json]                                                        \n' +
  '  croc link [--lenient]                                                               \n' +
  '  croc install                                                                        \n' +
  '  croc test                                                                           \n' +
  '  croc build                                                                          \n' +
  '  croc publish                                                                        \n' +
  '  croc exec CMD                                                                       \n' +
  '                                                                                      \n' +
  'Options:                                                                              \n' +
  '  -h --help     Show this screen.                                                     \n' +
  '  --version     Show version.                                                         \n' +
  '  --json        Show information in JSON format.                                      \n' +
  '  --lenient     Ignore that project dependency doesnt satisfies version (semver)      \n'

var docopt = require('docopt').docopt
var args = docopt(doc, { version: require('../package.json').version })

var deps = require('croc-deps')
var link = require('croc-link')
var exec = require('croc-exec')

var table = require('text-table')
var chalk = require('chalk')

var r = new RegExp('\x1b(?:\\[(?:\\d+[ABCDEFGJKSTm]|\\d+;\\d+[Hfm]|' +
  '\\d+;\\d+;\\d+m|6n|s|u|\\?25[lh])|\\w)', 'g')

var _ansiTrim = function (str) { return str.replace(r, '') }

var _printPackages = function (res) {
  console.log(JSON.stringify(pkgs.nodes().map(function (name) {
    var pkg = pkgs.node(name)
    return {name: pkg.name, version: pkg.version, file: pkg._file}
  }), null, 2))
}

var _printDependencies = function (res) {
  console.log(JSON.stringify(pkgs.nodes().map(function (name) {
    var pkg = pkgs.node(name)
    var deps = pkgs.out(name).map(function (dep) {
      return {name: dep, version: pkgs.edge(name, dep)}
    })
    return {name: pkg.name, version: pkg.version, dependencies: deps}
  }), null, 2))
}

var _printTable = function (tableObj) {
  var tbl = tableObj || {}
  tbl.options.stringLength = function (s) { return _ansiTrim(s).length }
  var thead_und = tbl.thead.map(function (n) { return chalk.underline(n) })
  var t = table([thead_und].concat(tbl.tbody), tbl.options)
  console.log(t)
}

var _printPacakgesTable = function (dag) {
  _printTable({
    thead: ['Package', 'Version', 'Location'],
    tbody: dag.nodes().map(function (key) {
      var pkg = dag.node(key)
      return [chalk.yellow(pkg.name), pkg.version, pkg._file]
    }),
    options: { align: ['l', 'r', 'l'] }
  })
}

var _printDependenciesTable = function (dag) {
  _printTable({
    thead: ['Package', 'Version', 'Depends on'],
    tbody: dag.nodes().map(function (key) {
      var pkg = dag.node(key)
      var name = pkg.name
      var ver = pkg.version
      var depon = dag.out(name).map(function (dep) {
        return dep + chalk.cyan('@' + dag.edge(name, dep))
      })
      return [chalk.yellow(name), ver, depon]
    }),
    options: { align: ['l', 'r', 'l'] }
  })
}

var pkgs = deps.packages()
if (args.ls) {
  if (args['--json']) {
    _printPackages()
  } else {
    _printPacakgesTable(pkgs)
  }
} else if (args.deps) {
  if (args['--json']) {
    _printDependencies(pkgs)
  } else {
    _printDependenciesTable(pkgs)
  }
} else if (args.link) {
  link.link({lenient: args['--lenient']})
} else if (args.test) {
  exec.exec('npm test')
} else if (args.build) {
  exec.exec('npm run build')
} else if (args.install) {
  exec.exec('npm install')
} else if (args.publish) {
  exec.exec('npm show %PKG_NAME% versions --json | grep -q \\"%PKG_VERSION%\\" || npm publish')
} else if (args.exec) {
  exec.exec(args.CMD)
}
