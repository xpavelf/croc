var table = require('text-table')
var chalk = require('chalk')

var _ansiTrim = function (str) { return str.replace(r, '') }
var r = new RegExp('\x1b(?:\\[(?:\\d+[ABCDEFGJKSTm]|\\d+;\\d+[Hfm]|' +
                   '\\d+;\\d+;\\d+m|6n|s|u|\\?25[lh])|\\w)', 'g')

var _printTable = function (tableObj) {
  var tbl = tableObj || {}
  tbl.options.stringLength = function (s) { return _ansiTrim(s).length }
  var thead_und = tbl.thead.map(function (n) { return chalk.underline(n) })
  var t = table([thead_und].concat(tbl.tbody), tbl.options)
  console.log(t)
}

exports.packages = function (dag) {
  console.log(JSON.stringify(dag.nodes().map(function (name) {
    var pkg = dag.node(name)
    return {name: pkg.name, version: pkg.version, file: pkg._file}
  }), null, 2))
}

exports.dependencies = function (dag) {
  console.log(JSON.stringify(dag.nodes().map(function (name) {
    var pkg = dag.node(name)
    var deps = dag.out(name).map(function (dep) {
      return {name: dep, version: dag.edge(name, dep)}
    })
    return {name: pkg.name, version: pkg.version, dependencies: deps}
  }), null, 2))
}

exports.packagesTable = function (dag) {
  _printTable({
    thead: ['Package', 'Version', 'Location'],
    tbody: dag.nodes().map(function (key) {
      var pkg = dag.node(key)
      return [chalk.yellow(pkg.name), pkg.version || '', pkg._file]
    }),
    options: { align: ['l', 'r', 'l'] }
  })
}

exports.dependenciesTable = function (dag) {
  _printTable({
    thead: ['Package', 'Version', 'Depends on'],
    tbody: dag.nodes().map(function (key) {
      var pkg = dag.node(key)
      var name = pkg.name
      var ver = pkg.version || ''
      var depon = dag.out(name).map(function (dep) {
        return dep + chalk.cyan('@' + dag.edge(name, dep))
      })
      return [chalk.yellow(name), ver, depon]
    }),
    options: { align: ['l', 'r', 'l'] }
  })
}
