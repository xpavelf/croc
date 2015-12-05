# croc
monolithic repository manager

[![NPM version](https://img.shields.io/npm/v/croc.svg)](https://npmjs.org/package/croc)
[![Build Status](https://travis-ci.org/xpavelf/croc.svg?branch=master)](https://travis-ci.org/xpavelf/croc)
[![NPM License](https://img.shields.io/npm/l/croc.svg)](https://npmjs.org/package/croc)

## What does it mean?

Well croc goes away from npm standard approach having packages in separated repositories. Instead all related packages can live in one repo so we can avoid endless cascading of commit, push, publish that usually happens if we need change package deep in our dependency tree.

## How croc works?

## Todo
* README.md


```
Usage:
  croc [options] ls [<package>...]
  croc [options] deps [<package>...]
  croc [options] exec CMD [<package>...]
  croc [options] pexec CMD [<package>...]
  croc [options] link
  croc [options] (install | test | publish) [<package> ..]

Options:
  -h, --help             Show this screen.
  -v, --version          Show version.
  --json                 Show information in JSON format.
  -p, --predecessors     Include projects depending on the packages.
  -x, --strict           Dependencies must statisfy version (semver)
  -c, --changed          Show only projects that is changed.
  -s, --since=SHA        Commit to diff against [default: master]
```
