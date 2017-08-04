const webpack = require('webpack');
const path = require('path');

console.log(path.resolve(__dirname, 'client', 'index.jsx'));

const isDev = process.env.NODE_ENV === 'dev';
module.exports = {
  context: __dirname,
  entry: './client/index',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'reporter.js',
    publicPath: '/',
  },
  resolve: {
    // modules: [path.resolve(__dirname\), 'node_modules'],
    extensions: ['.js', '.jsx'],
  },
  devtool: isDev ? 'eval' : 'source-map',
  watch: isDev,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              minimize: !isDev,
              localIdentName: `[name]__[local]`,
            },
          },
        ],
      },
    ],
  },
  plugins: (plugins => {
    if (isDev) {
      // plugins.push([new webpack.NamedModulesPlugin()]);
      return plugins;
    }
    return plugins;
  })([]),
};
