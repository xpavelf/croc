import * as deps from 'croc-deps';
import * as list from 'croc-list';
import path from 'path';
import shelljs from 'shelljs';

export function link({ lenient }) {
  const pkgs = list.packages();
  const order = deps.order({ lenient });
  
  order.forEach(([pkg, , deps]) => {
    const pkgjson = pkgs.get(pkg).file;
    const mapping = deps.forEach(dep => {
      const [dName] = dep.split('#');
        const linkPath = path.join(path.dirname(pkgjson), 'node_modules');
        const link = path.join(linkPath, dName);
        const targetPath = path.dirname(pkgs.get(dName).file);
        shelljs.mkdir('-p', linkPath);
        shelljs.ln('-sf', targetPath, link);
    });
  });
};
