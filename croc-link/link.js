var deps = require('croc-deps')
var path = require('path')
var shelljs = require('shelljs')

exports.link = function () {
  var pkgs = deps.packages()
  var order = deps.order()

  order.forEach(function (name) {
    var pkg = pkgs.node(name)
    var deps = pkgs.out(name)
    var pkgjson = pkg._file

    deps.forEach(function (name) {
      var linkPath = path.join(path.dirname(pkgjson), 'node_modules')
      var link = path.join(linkPath, name)
      var targetPath = path.dirname(pkgs.node(name)._file)
      shelljs.mkdir('-p', linkPath)
      shelljs.ln('-sf', targetPath, link)
      console.error('ln -sf ' + targetPath + ' ' + link)
    })
  })
}
