var deps = require('croc-deps')
var path = require('path')
var shelljs = require('shelljs')

exports.exec = function (command, latient) {
  var order = deps.order(latient || false)
  order
    .forEach(function (pkgInfo) {
      var cmd = command
        .replace('%PKG_NAME%', pkgInfo[0])
        .replace('%PKG_VERSION%', pkgInfo[1])

      shelljs.cd(path.dirname(pkgInfo[3]))
      console.error(cmd)
      shelljs.exec(cmd)
    })
}
