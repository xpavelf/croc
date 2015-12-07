function quote (name) {
  return '"' + name + '"'
}
module.exports = function (dag) {
  var out = ['digraph deps {']
  dag.nodes().forEach(function (node) {
    out.push()
    dag.out(node).forEach(function (edge) {
      out.push('  ' + quote(node) + ' -> ' + quote(edge) + ';')
    })
  })
  out.push('}')
  out.push('')
  return out.join('\n')
}
