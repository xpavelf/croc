import shell from 'shelljs';
import path from 'path';
const cwd = process.cwd();

const _ignoreFileName = '.crocignore';
const _getIgnored = () => {
  const ipath = path.join(cwd, _ignoreFileName);
  if (shell.test('-e', ipath)) {
    return shell.cat(ipath).split('\n');
  }
  return [];
};

export function packages() {
  const ignored = _getIgnored();
  const packages = shell
    .find(cwd)
    .filter(f => f.endsWith('package.json'))
    .filter(f => ignored.every(ifile => !f.includes(ifile)))
    .reduce((sum, f) => {
      const info = require(f);
      return sum.set(info.name, { name: info.name, version: info.version, file: f });
    }, new Map());
  
  return packages;
};

