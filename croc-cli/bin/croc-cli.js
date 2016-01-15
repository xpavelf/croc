#!/usr/bin/env node
var doc = [
  'Usage:',
  '  croc [options] ls [<package>...]',
  '  croc [options] deps [<package>...]',
  '  croc [options] exec CMD [<package>...]',
  '  croc [options] pexec CMD [<package>...]',
  '  croc [options] link',
  '  croc [options] (install | test | publish) [<package> ..]',
  '',
  'Options:',
  '  -h, --help             Show this screen.',
  '  -v, --version          Show version.',
  '  --json                 Show information in JSON format.',
  '  --dot                  Show information in DOT format.',
  '  -p, --predecessors     Include projects depending on the packages.',
  '  -s, --successors       Include projects depending on the packages.',
  '  -x, --strict           Dependencies must statisfy version (semver)',
  '  -c, --changed          Show only projects that is changed.',
  '  --since=SHA            Commit to diff against. [default: master]'
].join('\n')

var docopt = require('docopt').docopt
var args = docopt(doc, { version: require('../package.json').version })

var dotWriter = require('croc-dag-dot')
var deps = require('croc-deps')
var link = require('croc-link')
var exec = require('croc-exec')
var git = require('croc-git')
var printer = require('../lib/dag-printer.js')

var pkgs = deps.packages(args['--strict'])
var includePkgs
if (args['<package>'].length > 0) {
  includePkgs = args['<package>']
} else {
  includePkgs = pkgs.nodes()
}
if (args['--changed']) {
  includePkgs = git.changed(pkgs, includePkgs, args['--since'])
}
if (args['--predecessors']) {
  includePkgs = includePkgs.concat(deps.getPredecessors(pkgs, includePkgs))
}
if (args['--successors']) {
  includePkgs = includePkgs.concat(deps.getSuccessors(pkgs, includePkgs))
}
pkgs = pkgs.filter(function (name) {
  return includePkgs.indexOf(name) >= 0
})

if (args.ls) {
  if (args['--json']) {
    printer.packages(pkgs)
  } else if (args['--dot']) {
    console.log(dotWriter(pkgs))
  } else {
    printer.packagesTable(pkgs)
  }
} else if (args.deps) {
  if (args['--json']) {
    printer.dependencies(pkgs)
  } else if (args['--dot']) {
    console.log(dotWriter(pkgs))
  } else {
    printer.dependenciesTable(pkgs)
  }
} else if (args.link) {
  link.link(pkgs)
} else if (args.test) {
  exec.pexec(pkgs, 'npm test')
} else if (args.install) {
  exec.pexec(pkgs, 'npm install')
} else if (args.publish) {
  exec.pexec(pkgs, 'npm show %PKG_NAME% versions --json | grep -q \\"%PKG_VERSION%\\" || npm publish')
} else if (args.exec) {
  exec.exec(pkgs, args.CMD)
} else if (args.pexec) {
  exec.pexec(pkgs, args.CMD)
}
