import shell from 'shelljs';
const cwd = process.cwd();



const packages = () => {
  const packages = shell
    .find(cwd)
    .filter(f => f.endsWith('package.json'))
    .filter(f => !f.includes('node_modules'))
    .filter(f => !f.includes('test'))
    .filter(f => !f.includes('.c9'))
    .reduce((sum, f) => {
      const info = require(f);
      return sum.set(info.name, { name: info.name, version: info.version, file: f });
    }, new Map());
  
  return packages;
};

export default { packages };