import graphlib from 'graphlib';
import semver from 'semver';
import cList from './list';
import table from 'text-table';
import chalk from 'chalk';
import ansiTrim from './utils/ansiTrim';

const order = ({strict, json}) => {
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

  if (json) {
    return graphlib.alg.topsort(graph).reverse();
  } else {
    const dOrder = graphlib.alg.topsort(graph).reverse();
    const tbody = dOrder.map(pName => [
      chalk.yellow(pName),
      packages.get(pName).version,
      graph.successors(pName).map(dName => dName + chalk.gray('#' + graph.edge(pName, dName)))
    ]);

    const thead = ['Package', 'Version' ,'Depends on'].map(n => chalk.underline(n));

    return table([thead].concat(tbody), {
      align: ['l', 'r', 'l'],
      stringLength: s => ansiTrim(s).length
    });
  }
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