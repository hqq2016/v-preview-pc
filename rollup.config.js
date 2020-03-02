import resolve from 'rollup-plugin-node-resolve' // 告诉 Rollup 如何查找外部模块
import commonjs from 'rollup-plugin-commonjs' // 将CommonJS模块转换为 ES2015 供 Rollup 处理
import vue from 'rollup-plugin-vue' // 处理vue文件
import babel from 'rollup-plugin-babel'  // rollup 的 babel 插件，ES6转ES5
import { terser } from 'rollup-plugin-terser';

// rollup.config.js
export default {
  input: "src/index.js",
  output: [
    {
      exports: 'named',
      name: 'vPreview',
      file: "./dist/index.js",
      format: "umd",
      plugins: [terser()]
    },
    {
      file: "./dist/index.esm.js",
      format: "esm"
    }
  ],
  plugins: [
    resolve(),
    commonjs({
      // // non-CommonJS modules will be ignored, but you can also
      // // specifically include/exclude files
      include: ['node_modules/**'], // Default: undefined

      // // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false, // Default: false

      // // if false then skip sourceMap generation for CommonJS modules
      sourceMap: false // Default: true
    }),
    vue(),
    babel()
    // babel({
    //   babelrc: false,
    //   "presets": [
    //     ["env", { "modules": false }]
    //   ],
    //   // include: ['src/**', 'node_modules/**'] // only transpile our source code
    //   exclude: 'node_modules/**'
    // }),
  ]
};
