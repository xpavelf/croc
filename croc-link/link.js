var deps = require('croc-deps')
var path = require('path')
var shelljs = require('shelljs')

function getBinaries (pkg) {
  var name = pkg.name
  var bin = pkg.bin
  var bins = []
  if (typeof bin === 'string') {
    bins = [{name: name, bin: bin}]
  } else {
    bins = Object.keys(bin).map(function (name) {
      return {name: name, bin: bin[name]}
    })
  }
  return bins
}

function getBinFiles (pkgInfo) {
  var bins = getBinaries(pkgInfo)
  var basepath = path.dirname(pkgInfo._file)
  return bins.map(function (bin) {
    return {
      file: path.join(basepath, bin.bin),
      name: bin.name
    }
  })
}

exports.link = function (pkgs) {
  var order = deps.order(pkgs)

  order.forEach(function (name) {
    var pkg = pkgs.node(name)
    var deps = pkgs.out(name)
    var pkgjson = pkg._file

    deps.forEach(function (name) {
      var linkPath = path.join(path.dirname(pkgjson), 'node_modules')
      var link = path.join(linkPath, name)
      var targetPath = path.dirname(pkgs.node(name)._file)
      var relativeTargetPath = path.relative(linkPath, targetPath)

      shelljs.mkdir('-p', path.dirname(link)) // scoped packages
      shelljs.ln('-sf', relativeTargetPath, link)
      console.error('ln -sf ' + relativeTargetPath + ' ' + link)

      if (pkgs.node(name).bin) {
        var binPackage = pkgs.node(name)
        var binPath = path.join(linkPath, '.bin')
        shelljs.mkdir('-p', binPath)
        getBinFiles(binPackage).forEach(function (bin) {
          var targetPath = path.join(binPath, bin.name)
          var linkTarget = path.relative(binPath, bin.file)
          console.error('chmod u+x ' + bin.file)
          shelljs.chmod('u+x', bin.file)
          shelljs.rm(targetPath)
          console.error('ln -sf ' + linkTarget + ' ' + targetPath)
          shelljs.ln('-sf', linkTarget, targetPath)
        })
      }
    })
  })
}
