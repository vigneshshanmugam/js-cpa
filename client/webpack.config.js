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
  devtool: isDev ? "eval" : "source-map",
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
        use: isDev
          ? ["style-loader", "css-loader"]
          : ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                {
                  loader: "css-loader",
                  options: {
                    minimize: true
                  }
                }
              ]
            })
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: isDev
          ? [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  modules: true
                }
              }
            ]
          : ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                {
                  loader: "css-loader",
                  options: {
                    minimize: true,
                    modules: true,
                    importLoaders: 1,
                    localIdentName: "[name]__[local]___[hash:base64:5]",
                    sourceMap: false
                  }
                }
              ]
            })
      }
    ]
  },
  plugins: isDev
    ? []
    : [
        new MinifyPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new ExtractTextPlugin("[name].css")
      ]
};
