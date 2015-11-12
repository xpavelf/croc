import babel from 'rollup-plugin-babel';

const pkg = require('./package.json').dependencies;


export default {
  format: 'cjs',
  banner: '#!/usr/bin/env node',
  intro: 'require("es6-shim");',
  
  external: Object.keys(pkg),
  
  entry: 'bin/croc-cli.js',
  dest: 'bin/croc-es5-cli.js',
  
  plugins: [ 
    babel({
      exclude: 'node_modules/**'
    })
  ]
};