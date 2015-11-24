import * as deps from 'croc-deps';
import path from 'path';
import shelljs from 'shelljs';

export function exec({ cmd }) {
  const order = deps.order({ latient: true });
  order
    .map(([,,,pkgjson]) => path.dirname(pkgjson))
    .forEach(modulePath => {
      shelljs.cd(modulePath);
      shelljs.exec(cmd);
    });
};
