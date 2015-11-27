var dag = require('croc-dag')
var semver = require('semver')
var list = require('croc-list')
var objectAssign = require('object-assign')

exports.order = function () {
  var graph = new dag.DAG()
  var packages = list.packages()

  Object.keys(packages).forEach(function (key) {
    var pkg = packages[key]
    var info = require(pkg.file)
    var pkgDeps = objectAssign({}, info.devDependencies, info.dependencies)
    graph.addNode(pkg.name)

    Object.keys(pkgDeps)
      .filter(function (dName) {
        return packages[dName]
      })
      .filter(function (dName) {
        return semver.satisfies(packages[dName].version, pkgDeps[dName])
      })
      .forEach(function (dName) {
        graph.addEdge(pkg.name, dName, pkgDeps[dName])
      })
  })

  return dag.alg.topsort(graph)
    .reverse()
    .map(function (pName) {
      return [
        pName,
        packages[pName].version,
        graph.out(pName).map(function (dName) { return dName + '#' + graph.edge(pName, dName) }),
        packages[pName].file
      ]
    })
}
