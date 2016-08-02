var Transform = require('stream').Transform
var dag = require('croc-dag')
var deps = require('croc-deps')
var path = require('path')
var shelljs = require('shelljs')
var chalk = require('chalk')

var prefixCmd = function (prefix, cmd) {
  return chalk.yellow('[' + prefix + '] ') + cmd
}

var prefixOut = function (prefix, cmd) {
  return chalk.gray('[' + prefix + '] ') + cmd
}

exports.exec = function (packages, command) {
  var order = deps.order(packages)
  order.forEach(function (name) {
    var pkg = packages.node(name)
    var cmd = command
      .replace('%PKG_NAME%', pkg.name)
      .replace('%PKG_VERSION%', pkg.version)

    shelljs.cd(path.dirname(pkg._file))
    console.error(prefixCmd(pkg.name, cmd))
    var child = shelljs.exec(cmd)
    if (child.code) {
      console.log(chalk.red('ERROR') + ' exited with code ' + child.code)
      process.exit(1)
    }
  })
}

function prefixStream (packageName) {
  var prefix = prefixOut(packageName, '')
  var ts = new Transform()
  var currentLine = ''
  function write (line) {
    if (line.trim() !== '') {
      ts.push(prefix + line + '\n')
    }
  }
  ts._transform = function (chunk, enc, cb) {
    var split = (currentLine + chunk.toString()).split(/\r?\n/)
    currentLine = split.pop()
    split.forEach(write)
    cb()
  }
  ts._flush = function (cb) {
    write(currentLine)
    cb()
  }
  return ts
}
exports.pexec = function (packages, command) {
  dag.alg.ordered(packages, function (name, callback) {
    var pkg = packages.node(name)
    var cmd = command
      .replace('%PKG_NAME%', pkg.name)
      .replace('%PKG_VERSION%', pkg.version)

    shelljs.cd(path.dirname(pkg._file))
    console.error(prefixCmd(pkg.name, cmd))

    var child = shelljs.exec(cmd, {async: true, silent: true})
    child.stdout
      .pipe(prefixStream(pkg.name))
      .pipe(process.stdout)

    child.stderr
      .pipe(prefixStream(pkg.name))
      .pipe(process.stderr)

    child.on('close', function (code) {
      if (code === 0) {
        callback()
      } else {
        console.log(prefixOut(name, chalk.red('ERROR') + ' exited with code ' + code))
        process.exit(1)
      }
    })
  })
}
