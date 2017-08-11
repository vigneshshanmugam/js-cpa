const webpack = require("webpack");
const path = require("path");

const BabiliPlugin = require("babili-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";
module.exports = {
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
  devtool: isDev ? "eval" : "source-map",
  watch: isDev,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: isDev
          ? [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  minimize: true
                }
              },
              {
                loader: "postcss-loader",
                options: {
                  config: {
                    path: path.join(__dirname, "postcss.config.js")
                  }
                }
              }
            ]
          : ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                {
                  loader: "css-loader",
                  options: {
                    minimize: true
                  }
                },
                {
                  loader: "postcss-loader",
                  options: {
                    config: {
                      path: path.join(__dirname, "postcss.config.js")
                    }
                  }
                }
              ]
            })
      }
    ]
  },
  plugins: [].concat(
    isDev
      ? []
      : [
          new BabiliPlugin(),
          new webpack.optimize.AggressiveMergingPlugin(),
          new ExtractTextPlugin("[name].css")
        ]
  )
};
