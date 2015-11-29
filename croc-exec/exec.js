var deps = require('croc-deps')
var path = require('path')
var shelljs = require('shelljs')
var chalk = require('chalk')

exports.exec = function (command) {
  var order = deps.order()
  var packages = deps.packages()
  order.forEach(function (name) {
    var pkg = packages.node(name)
    var cmd = command
      .replace('%PKG_NAME%', pkg.name)
      .replace('%PKG_VERSION%', pkg.version)

    shelljs.cd(path.dirname(pkg._file))
    console.error(chalk.yellow(pkg.name) + '> ' + cmd)
    shelljs.exec(cmd)
  })
}
