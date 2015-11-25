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
  const pkgs = shell
    .find(cwd)
    .filter(f => f.endsWith('package.json'))
    .filter(f => ignored.every(ifile => f.indexOf(ifile) === -1))
    .reduce((sum, f) => {
      const info = require(f);
      sum[info.name] = { name: info.name, version: info.version, file: f };
      return sum;
    }, {});
  
  return pkgs;
};

