import shell from 'shelljs';
import table from 'text-table';
import chalk from 'chalk';
import ansiTrim from './utils/ansiTrim';
const cwd = process.cwd();

const packages = (json) => {
  const packages = shell
    .find(cwd)
    .filter(f => f.endsWith('package.json'))
    .filter(f => !f.includes('node_modules'))
    .reduce((sum, f) => {
      const info = require(f);
      return sum.set(info.name, { name: info.name, version: info.version, file: f });
    }, new Map());
  
  if (json === true) {
    return packages;
  } else {
    const tbody = Array.from(packages)
      .map(([, pkg]) => [chalk.yellow(pkg.name), pkg.version, pkg.file]);
    const thead = ['Package', 'Version', 'Location'].map(n => chalk.underline(n));
    return table([thead].concat(tbody), {
      align: ['l', 'r', 'l'],
      stringLength: s => ansiTrim(s).length
    });
  }
};

export default { packages };