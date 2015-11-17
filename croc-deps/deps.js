import graphlib from 'graphlib';
import semver from 'semver';
import cList from 'croc-list';


const order = ({strict}) => {
  const graph = new graphlib.Graph();
  const packages = cList.packages(true);

  packages.forEach((pkg) => {
    const info = require(pkg.file);
    const pkgDeps = info.dependencies || {};
    graph.setNode(pkg.name);
    
    Object.keys(pkgDeps)
      .filter(dName => packages.has(dName))
      .filter(dName => !strict || semver.satisfies(packages.get(dName).version, pkgDeps[dName]))
      .forEach(dName => graph.setEdge(pkg.name, dName, pkgDeps[dName]));
  });

  return graphlib.alg.topsort(graph)
    .reverse()
    .map(pName => [
      pName,
      packages.get(pName).version,
      graph.successors(pName).map(dName => dName + '#' + graph.edge(pName, dName))
    ]);
};

export default { order };

// const findPredecessors = (graph, node) => {
//   let acc = new Set()
//   let findPredAcc = (node) => {
//     graph.predecessors(node).forEach(n => findPredAcc(n));
//     return acc.add(node);
//   }
//   return findPredAcc(node);
// }

// const needBuild = changed.reduce((sum, ch) => new Set([...sum, ...findPredecessors(graph, ch)]), new Set());