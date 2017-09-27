const recursive = require('recursive-readdir-sync');
const argument = require('ezzy-argument');
const path = require('path');

const root = argument('WEBPACK_ROOT', './src');
const jsExt = argument('WEBPACK_JS_MIN_EXT', 'js');
const watch = argument('WEBPACK_WATCH', 'true') === 'true';

const VALID_JS_FILE_REG = /^(.*)\/(jsx|ts)\/([^_][^/\\]*\.(jsx|ts))$/i;

const entry = recursive(path.normalize(__dirname + '/' + root))
  .filter(file => VALID_JS_FILE_REG.test(file) && !/\.bak\./.test(file))
  .reduce((obj, file) => {
    const source = './' + path.relative(__dirname, file);
    const dest = source.replace(VALID_JS_FILE_REG,
      (a, b, c, d) => (b + '/js/' + d.toLowerCase() + '.' + jsExt));
    return Object.assign(obj, {[dest]: source});
  }, {});

module.exports = {
  watch,
  entry,
  output: {
    filename: './[name]',
    path: __dirname
  },
  plugins: [],
  devtool: 'source-map',
  resolve: {
    extensions: ['.jsx', '.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'angular2']
            }
          }
        ]
      },
      {
        test: /^.*\.jsx?$/,
        loaders: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['es2015', 'react']
            }
          }
        ]
      }
    ]
  }
};
