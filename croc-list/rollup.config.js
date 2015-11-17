import babel from 'rollup-plugin-babel';

var pkgInfo = require('./package.json');

export default {
  format: 'cjs',
  
  entry: pkgInfo['jsnext:main'],
  dest: pkgInfo['main'],
  
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};