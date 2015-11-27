module.exports = function (dag) {
  var visited = {}
  var stack = {}
  var results = []

  dag.sinks().forEach(function visit (v) {
    if (stack[v]) {
      throw new Error('Cycle detected')
    }
    if (!visited[v]) {
      stack[v] = true
      visited[v] = true
      dag.in(v).forEach(visit)
      delete stack[v]
      results.push(v)
    }
  })

  if (Object.keys(visited).length !== dag.nodes().length) {
    throw new Error('Cycle detected')
  }

  return results
}
