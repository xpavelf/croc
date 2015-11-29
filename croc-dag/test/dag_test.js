/* global describe it */
var assert = require('assert')
var DAG = require('../lib/dag')

describe('Directed Asyclic Graph', function () {
  it('should be able to add nodes', function () {
    var dag = new DAG()
    dag.addNode('a')
    dag.addNode('b')
    assert.ok(dag.hasNode('a'), 'a should exist in the DAG')
    assert.ok(dag.hasNode('b'), 'b should exist in the DAG')
  })

  it('should be able to add edges', function () {
    var dag = new DAG()
    dag.addEdge('a', 'b')
    assert.ok(dag.hasNode('a'), 'a should exist in the DAG')
    assert.ok(dag.hasNode('b'), 'b should exist in the DAG')
    assert.ok(dag.in('a').length === 0, 'a should not have edges in')
    assert.ok(dag.in('b').length === 1, 'b should have one edge in')
    assert.ok(dag.out('b').length === 0, 'a should not have edges out')
    assert.ok(dag.out('a').length === 1, 'a should have one edge out')
  })

  it('should be able to add multiplel edges', function () {
    var dag = new DAG()
    dag.addEdge('a', 'b')
    dag.addEdge('b', 'c')
    assert.ok(dag.nodes().indexOf('a') >= 0, 'a should exist in the DAG')
    assert.ok(dag.nodes().indexOf('b') >= 0, 'b should exist in the DAG')
    assert.ok(dag.nodes().indexOf('c') >= 0, 'c should exist in the DAG')
    assert.ok(dag.in('a').length === 0, 'a should not have edges in')
    assert.ok(dag.in('b').length === 1, 'b should have one edge in')
    assert.ok(dag.in('c').length === 1, 'c should have one edge in')
    assert.ok(dag.out('c').length === 0, 'c should not have edges out')
    assert.ok(dag.out('b').length === 1, 'b should have one edge out')
    assert.ok(dag.out('a').length === 1, 'a should have one edge out')
  })

  it('should be able to remove nodes', function () {
    var dag = new DAG()
    dag.addEdge('a', 'b')
    dag.addEdge('b', 'c')
    assert.ok(dag.hasNode('a'), 'a should exist in the DAG')
    assert.ok(dag.hasNode('b'), 'b should exist in the DAG')
    assert.ok(dag.hasNode('c'), 'c should exist in the DAG')
    dag.removeNode('b')
    assert.ok(dag.in('a').length === 0, 'a should not have edges in')
    assert.ok(dag.in('b').length === 0, 'b should not have edges in')
    assert.ok(dag.in('c').length === 0, 'c should not have edges in')
    assert.ok(dag.out('c').length === 0, 'c should not have edges out')
    assert.ok(dag.out('b').length === 0, 'b should not have edges out')
    assert.ok(dag.out('a').length === 0, 'a should not have edges out')
  })

  it('should be able to get sinks', function () {
    var dag = new DAG()
    dag.addEdge('a', 'b')
    dag.addEdge('a', 'c')
    assert.ok(dag.sinks().length === 2, 'should have 2 sinks')
    assert.ok(dag.sinks().indexOf('a') === -1, 'a should not be a sink')
    assert.ok(dag.sinks().indexOf('b') >= 0, 'b should be a sink')
    assert.ok(dag.sinks().indexOf('c') >= 0, 'c should be a sink')
  })

  it('should be able to get sources', function () {
    var dag = new DAG()
    dag.addEdge('a', 'b')
    dag.addEdge('a', 'c')
    dag.addEdge('d', 'b')
    assert.ok(dag.sources().length === 2, 'should have 2 sources')
    assert.ok(dag.sources().indexOf('b') === -1, 'b should not be a source')
    assert.ok(dag.sources().indexOf('c') === -1, 'c should not be a source')
    assert.ok(dag.sources().indexOf('a') >= 0, 'b should be a source')
    assert.ok(dag.sources().indexOf('d') >= 0, 'd should be a source')
  })
})