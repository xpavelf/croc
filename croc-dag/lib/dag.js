var DAG = function (opts) {
  this._nodes = {}
  this._in = {}
  this._out = {}
}

DAG.prototype.nodes = function () {
  return Object.keys(this._nodes)
}

DAG.prototype.out = function (v) {
  return Object.keys(this._out[v] || {})
}

DAG.prototype.in = function (v) {
  return Object.keys(this._in[v] || {})
}

DAG.prototype.sources = function () {
  var self = this
  return this.nodes().filter(function (v) {
    return self.in(v).length === 0
  })
}

DAG.prototype.sinks = function () {
  var self = this
  return this.nodes().filter(function (v) {
    return self.out(v).length === 0
  })
}

DAG.prototype.node = function (v) {
  return this._nodes[v]
}

DAG.prototype.addNode = function (v, value) {
  this._nodes[v] = value
  this._in[v] = this._in[v] || {}
  this._out[v] = this._out[v] || {}
}

DAG.prototype.removeNode = function (v, value) {
  var self = this
  this.in(v).forEach(function (w) {
    delete self._out[w][v]
  })
  this.out(v).forEach(function (w) {
    delete self._in[w][v]
  })
  delete this._nodes[v]
  delete this._in[v]
  delete this._out[v]
}

DAG.prototype.hasNode = function (v) {
  return this._nodes.hasOwnProperty(v)
}

DAG.prototype.edge = function (v, w) {
  return this._out[v][w]
}

DAG.prototype.addEdge = function (v, w, label) {
  if (!this.hasNode(v)) {
    this.addNode(v)
  }
  if (!this.hasNode(w)) {
    this.addNode(w)
  }
  this._in[w][v] = label
  this._out[v][w] = label
}

DAG.prototype.filter = function (filterFunction) {
  var self = this
  var newDAG = new DAG()
  this.nodes().forEach(function (name) {
    var pkg = self.node(name)
    if (filterFunction(name)) {
      newDAG.addNode(pkg.name, pkg)
    }
  })
  newDAG.nodes().forEach(function (name) {
    self.in(name).forEach(function (v) {
      if (newDAG.hasNode(v)) {
        newDAG.addEdge(v, name, self.edge(v, name))
      }
    })
    self.out(name).forEach(function (w) {
      if (newDAG.hasNode(w)) {
        newDAG.addEdge(name, w, self.edge(name, w))
      }
    })
  })
  return newDAG
}

module.exports = DAG
