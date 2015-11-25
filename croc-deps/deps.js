var graphlib = require('graphlib');
var semver = require('semver');
var list = require('croc-list');

exports.order = function(options) {
  var opts = options || {};
  var graph = new graphlib.Graph();
  var packages = list.packages();

  Object.keys(packages).forEach(function(key) {
    var pkg = packages[key];
    var info = require(pkg.file);
    var pkgDeps = info.dependencies || {};
    graph.setNode(pkg.name);
    
    Object.keys(pkgDeps)
      .filter(function(dName) { return packages[dName]; })
      .filter(function(dName) { return options.lenient || semver.satisfies(packages[dName].version, pkgDeps[dName]); })
      .forEach(function(dName) { graph.setEdge(pkg.name, dName, pkgDeps[dName]) });
  });

  return graphlib.alg.topsort(graph)
    .reverse()
    .map(function(pName) { 
      return [
        pName,
        packages[pName].version,
        graph.successors(pName).map(function(dName) { return dName + '#' + graph.edge(pName, dName); }),
        packages[pName].file
      ];
    });
};

// var findPredecessors = (graph, node) => {
//   let acc = new Set()
//   let findPredAcc = (node) => {
//     graph.predecessors(node).forEach(n => findPredAcc(n));
//     return acc.add(node);
//   }
//   return findPredAcc(node);
// }

// var needBuild = changed.reduce((sum, ch) => new Set([...sum, ...findPredecessors(graph, ch)]), new Set());