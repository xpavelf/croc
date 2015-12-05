module.exports = function (dag, node) {
  var visited = {}
  var result = []
  function dfs (dag, v) {
    result.push(v)
    visited[v] = true
    dag.in(v).forEach(function (w) {
      if (!visited[w]) {
        dfs(dag, w)
      }
    })
    result.push(v)
  }
  dfs(dag, node)
  return result
}
