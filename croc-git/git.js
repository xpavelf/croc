var path = require('path')
var shell = require('shelljs')
var cwd = process.cwd()

exports.changed = function (packages, includePkgs, sha) {
  return includePkgs.filter(function (name) {
    // Getting changes from git for each package is slower in monolithic
    // repositories, but enables working with multiple git repositories
    var pkg = packages.node(name)
    var dir = path.dirname(pkg._file)
    shell.cd(dir)
    var changes = shell
          .exec('git diff --name-only ' + sha, {silent: true})
          .output.split('\n')
          .filter(function (str) {
            return str.trim() !== ''
          })
          .map(function (f) {
            return path.join(cwd, f)
          })
    var changedInProject = changes.filter(function (changed) {
      return changed.startsWith(dir + '/')
    })
    return changedInProject.length !== 0
  })
}
