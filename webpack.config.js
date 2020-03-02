const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  entry: {
    'index': './src/index.js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    publicPath: '/dist',
    filename: 'index.js',
    // export to AMD, CommonJS, or window
    libraryTarget: 'umd',
    // the name exported to window
    library: 'vPreview',
    umdNamedDefine: true
  },
  optimization: {
    minimize: true,
    minimizer: [
      //可以支持es6,默认的使用TerserPlugin
      new TerserPlugin({
        include: /\.min\.js/
      })
    ]
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin()
  ]
}