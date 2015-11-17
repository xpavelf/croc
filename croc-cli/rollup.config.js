import babel from 'rollup-plugin-babel';

export default {
  format: 'cjs',
  banner: '#!/usr/bin/env node',
  intro: 'require("es6-shim");',
  
  entry: 'bin/croc-cli.js',
  dest: 'bin/croc-es5-cli.js',
  
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};