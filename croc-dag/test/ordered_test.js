/* global describe it */
var assert = require('assert')
var DAG = require('../lib/dag')
var ordered = require('../lib/ordered')

describe('Ordered Execution', function () {
  it('execute in reverse order', function () {
    var count = 0
    var dag = new DAG()
    dag.addEdge('a', 'b')
    dag.addEdge('b', 'c')

    ordered(dag, function (node, cb) {
      if (node === 'c') {
        assert.equal(++count, 1, 'c should be first')
      }
      if (node === 'b') {
        assert.equal(++count, 2, 'b should be second')
      }
      if (node === 'a') {
        assert.equal(++count, 3, 'a should be last')
      }
      cb()
    })
    assert.equal(count, 3, 'called 3 times')
  })
})
