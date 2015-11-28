var dag = require('croc-dag')
var semver = require('semver')
var list = require('croc-list')
var objectAssign = require('object-assign')

exports.packages = function packages (options) {
  var graph = new dag.DAG()
  var pkgs = list.packages()

  Object.keys(pkgs).forEach(function (key) {
    var pkg = pkgs[key]
    var info = require(pkg.file)
    info._file = pkg.file // _prefix is reserved for this by NPM
    var pkgDeps = objectAssign({}, info.devDependencies, info.dependencies)
    graph.addNode(pkg.name, info) // get info by `graph.node(pkg.name)`

    Object.keys(pkgDeps)
      .filter(function (dName) {
        return pkgs[dName]
      })
      .filter(function (dName) {
        return !options.strict || semver.satisfies(pkgs[dName].version, pkgDeps[dName])
      })
      .forEach(function (dName) {
        graph.addEdge(pkg.name, dName, pkgDeps[dName])
      })
  })
  return graph
}

exports.order = function () {
  return dag.alg.topsort(exports.packages()).reverse()
}
