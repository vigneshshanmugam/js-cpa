const webpack = require("webpack");
const path = require("path");

const BabiliPlugin = require("babili-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";
module.exports = {
  context: __dirname,
  entry: "./index",
  output: {
    path: path.join(__dirname, "..", "public"),
    filename: "reporter.js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"]
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
        use: [
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
      }
    ]
  },
  plugins: (plugins => {
    if (isDev) {
      // plugins.push([new webpack.NamedModulesPlugin()]);
      return plugins;
    }
    plugins.push(new BabiliPlugin());
    return plugins;
  })([])
};
