import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import cleanup from 'rollup-plugin-cleanup';
import bundleSize from 'rollup-plugin-bundle-size';
import path from 'path';

export default {
  entry: 'source/server.js',
  external: [
    path.resolve('./source/conf.json'),
    'url',
    'path',
    'http',
    'https',
    'fs',
    'os',
    'util',
    'events',
    'buffer',
    'child_process',
    'crypto',
    'stream',
    'querystring'
  ],
  plugins: [
    json(),
    babel({
      presets: [
        [
          'env',
          {
            targets: { node: 'current' },
            modules: false
          }
        ]
      ],
      plugins: [
        'lodash',
        ['transform-object-rest-spread', { useBuiltIns: true }],
        'transform-flow-strip-types',
        'external-helpers'
      ],
      babelrc: false
    }),
    nodeResolve({ jsnext: true, main: true, preferBuiltins: false }),
    commonjs(),
    cleanup(),
    bundleSize()
  ],
  sourceMap: true,
  format: 'cjs'
};
