const doc = 
`
Usage:
  croc ls [--json]
  croc deps [--strict --json]
  croc [ link | test | build | unlink ]

Options:
  -h --help     Show this screen.
  --version     Show version.
  --json        Show information in JSON format.
  --strict      Ignore project dependency if it doesn't satisfies version (semver)
`;

import { docopt } from 'docopt';
const args = docopt(doc, { version : '0.0.1' });

import list from '../lib/list';
import dependency from '../lib/dependency';

const _print = res => console.log(res);

if (args.ls) {
  _print(list.packages(args['--json']));
} else if (args.deps) {
  _print(dependency.order({
    strict: args['--strict'],
    json: args['--json']
  }));
} else if (args.link) {
  console.error('Not implemented yet!');
} else if (args.unlink) {
  console.error('Not implemented yet!');
} else if (args.test) {
  console.error('Not implemented yet!');
} else if (args.build) {
  console.error('Not implemented yet!');
}

