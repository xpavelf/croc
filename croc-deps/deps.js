var dag = require('croc-dag')
var semver = require('semver')
var list = require('croc-list')
var objectAssign = require('object-assign')

exports.packages = function packages (strict) {
  var graph = new dag.DAG()
  var pkgs = list.packages()

  Object.keys(pkgs)
    .forEach(function (key) {
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
          return !strict || semver.satisfies(pkgs[dName].version, pkgDeps[dName])
        })
        .forEach(function (dName) {
          graph.addEdge(pkg.name, dName, pkgDeps[dName])
        })
    })
  return graph
}

exports.order = function (packages) {
  return dag.alg.topsort(packages).reverse()
}

exports.getPredecessors = function (graph, packages) {
  var included = []
  packages.forEach(function (name) {
    dag.alg.reverseDfs(graph, name).forEach(function (name) {
      included.push(name)
    })
  })
  return included
}

exports.getSuccessors = function (graph, packages) {
  var included = []
  packages.forEach(function (name) {
    dag.alg.dfs(graph, name).forEach(function (name) {
      included.push(name)
    })
  })
  return included
}
