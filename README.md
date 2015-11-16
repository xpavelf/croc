# croc
monolithic repository manager

[![NPM version](https://img.shields.io/npm/v/croc.svg?style=flat-square)](https://npmjs.org/package/croc)
[![Dependency Status](https://david-dm.org/xpavelf/croc.svg?style=flat-square)](https://david-dm.org/xpavelf/croc)

## What does it mean?

Well croc goes away from standard npm approach having packages in separated repositories. Instead all related packages can be in one repo so we can avoid endless cascading of commit, push, publish that usually happens if we need change package deep in our dependency tree.

## How croc works?

Todo


```
Usage:
  croc ls [--json]
  croc deps [--strict --json]
  croc [ link | test | build | unlink ]

Options:
  -h --help     Show this screen.
  --version     Show version.
  --json        Show information in JSON format.
  --strict      Ignore project dependency if it doesn't satisfies version (semver)
```
