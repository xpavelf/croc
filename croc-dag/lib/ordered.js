module.exports = function (dag, cb) {
  var counts = dag
    .nodes()
    .reduce(function (sum, v) {
      sum[v] = dag.out(v).length
      return sum
    }, {})

  function visit (v) {
    cb(v, function () {
      dag.in(v).forEach(function (w) {
        if (--counts[w] === 0) {
          visit(w)
        }
      })
    })
  }

  dag.nodes().forEach(function (v) {
    if (counts[v] === 0) {
      visit(v)
    }
  })
}
