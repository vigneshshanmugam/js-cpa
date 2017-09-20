const webpack = require("webpack");
const path = require("path");

const MinifyPlugin = require("babel-minify-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";
module.exports = {
  stats: {
    modules: false
  },
  context: __dirname,
  entry: {
    reporter: "./index"
  },
  output: {
    path: path.join(__dirname, "..", "public"),
    filename: "[name].js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devtool: isDev ? "cheap-module-inline-source-map" : "source-map",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                minimize: !isDev
              }
            }
          ]
        })
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                minimize: !isDev,
                modules: true,
                importLoaders: 1,
                localIdentName: isDev
                  ? "[name]__[local]___[hash:base64:5]"
                  : "[hash:base64:8]"
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [new ExtractTextPlugin("[name].css")].concat(
    isDev
      ? []
      : [
          new MinifyPlugin(),
          new webpack.optimize.ModuleConcatenationPlugin(),
          new webpack.optimize.AggressiveMergingPlugin()
        ]
  )
};
