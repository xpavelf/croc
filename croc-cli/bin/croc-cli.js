const doc = 
`
Usage:
  croc ls [--json]
  croc deps [--lenient --json]
  croc ( link [--lenient] | test | build )

Options:
  -h --help     Show this screen.
  --version     Show version.
  --json        Show information in JSON format.
  --lenient     Ignore that project dependency doesn't satisfies version (semver)
`;

const docopt = require('docopt').docopt;
const args = docopt(doc, { version : '0.0.1' });

import * as list from 'croc-list';
import * as deps from 'croc-deps';
import * as link from 'croc-link';
import * as exec from 'croc-exec';

import table from 'text-table';
import chalk from 'chalk';

const r = new RegExp('\x1b(?:\\[(?:\\d+[ABCDEFGJKSTm]|\\d+;\\d+[Hfm]|' +
        '\\d+;\\d+;\\d+m|6n|s|u|\\?25[lh])|\\w)', 'g');

const _ansiTrim = (str) => str.replace(r, '');

const _print = res => console.log(res);

const _printTable = ({ thead, tbody, options }) => {
  const opts = Object.assign({ stringLength: s => _ansiTrim(s).length }, options);
  const thead_und = thead.map(n => chalk.underline(n));
  const t = table([thead_und].concat(tbody), opts);
  _print(t); 
};

if (args.ls) {
  const pkgs = list.packages();
  if (args['--json']) {
    _print(pkgs);
  } else {
    _printTable({
      thead: ['Package', 'Version', 'Location'],
      tbody: Array.from(pkgs)
        .map(([, pkg]) => [chalk.yellow(pkg.name), pkg.version, pkg.file]),
      options: { align: ['l', 'r', 'l'] }
    });
  }
  
} else if (args.deps) {
  const order = deps.order({ lenient: args['--lenient'] });
  if (args['--json']) {
    _print(order);  
  } else {
    const depMap = dep => {
      const [d0, d1] = dep.split('#'); 
      return d0 + chalk.gray('#' + d1);
    };
    
    _printTable({
      thead: ['Package', 'Version' ,'Depends on'],
      tbody: order.map(([pkg, ver, depon]) => [
        chalk.yellow(pkg), ver, depon.map(depMap)]),
      options: { align: ['l', 'r', 'l'] }
    });
  }
  
} else if (args.link) {
  link.link({ lenient: args['--lenient'] });
} else if (args.test) {
  exec.exec({ cmd: 'npm test'});
} else if (args.build) {
  exec.exec({ cmd: 'npm run build' });
}
