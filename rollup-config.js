import babel from "rollup-plugin-babel";
import cleanup from "rollup-plugin-cleanup";
import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import json from "rollup-plugin-json";
import nodeResolve from "rollup-plugin-node-resolve";

export default {
  input: "source/server.js",
  external: [
    "url",
    "path",
    "http",
    "https",
    "fs",
    "os",
    "util",
    "events",
    "buffer",
    "child_process",
    "stream",
    "querystring"
  ],
  output: {
    sourcemap: true,
    format: "cjs",
    file: "targetdir/bundle.js"
  },
  plugins: [
    json(),
    babel({
      presets: [
        [
          "env",
          {
            targets: { node: "current" },
            modules: false
          }
        ]
      ],
      plugins: [
        "lodash",
        ["transform-object-rest-spread", { useBuiltIns: true }],
        "transform-flow-strip-types",
        "external-helpers"
      ],
      babelrc: false
    }),
    nodeResolve({ jsnext: true, main: true, preferBuiltins: false }),
    commonjs(),
    cleanup(),
    filesize()
  ]
};
