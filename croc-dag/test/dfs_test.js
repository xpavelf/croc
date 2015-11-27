/* global describe it */
var assert = require('assert')
var DAG = require('../lib/dag')
var dfs = require('../lib/dfs')
var reverseDfs = require('../lib/reverseDfs')

describe('Depth First Search', function () {
  it('should find preorder', function () {
    var dag = new DAG()
    dag.addEdge('a', 'b')
    dag.addEdge('b', 'c')

    var result = dfs(dag, 'a')

    assert.ok(result[0] = 'a', 'a is first')
    assert.ok(result[1] = 'b', 'b is second')
    assert.ok(result[2] = 'c', 'c is last')
  })
})

describe('Reverse Depth First Search', function () {
  it('should find preorder', function () {
    var dag = new DAG()
    dag.addEdge('a', 'b')
    dag.addEdge('b', 'c')

    var result = reverseDfs(dag, 'a')

    assert.ok(result[2] = 'c', 'c is first')
    assert.ok(result[1] = 'b', 'b is second')
    assert.ok(result[0] = 'a', 'a is last')
  })
})
