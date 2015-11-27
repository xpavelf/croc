module.exports = {
  DAG: require('./dag'),
  alg: {
    dfs: require('./dfs'),
    reverseDfs: require('./reverseDfs'),
    topsort: require('./topsort'),
    ordered: require('./ordered')
  }
}
