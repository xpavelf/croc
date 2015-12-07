/*global describe, it */
var DAG = require('croc-dag').DAG
var dotWriter = require('./index')
var assert = require('assert')

describe('Directed Asyclic Graph printer', function () {
  it('should print a digraph', function () {
    var dag = new DAG()
    var dotGraph = dotWriter(dag)
    assert(dotGraph.indexOf('digraph') >= 0)
  })
  it('should print a edge', function () {
    var dag = new DAG()
    dag.addEdge('a', 'b')
    var dotGraph = dotWriter(dag)
    assert(dotGraph.indexOf('"a" -> "b"') >= 0)
  })
  it('should print multiple edges', function () {
    var dag = new DAG()
    dag.addEdge('a', 'b')
    dag.addEdge('a', 'c')
    dag.addEdge('b', 'c')
    var dotGraph = dotWriter(dag)
    assert(dotGraph.indexOf('"a" -> "b"') >= 0)
    assert(dotGraph.indexOf('"a" -> "c"') >= 0)
    assert(dotGraph.indexOf('"b" -> "c"') >= 0)
  })
})
