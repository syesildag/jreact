const webpack = require("webpack");
const path = require("path");

let config = env => {

  let NODE_ENV = env.NODE_ENV;
  let development = NODE_ENV === "development";
  let production = NODE_ENV === "production";

  return {
    entry: {
      index: path.join(__dirname, 'src', 'index.tsx')
    },
    devtool: development ? "source-map" : false,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.json', '.js', '.jsx', '.ts', '.tsx', '.css']
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist')
    },
    mode: NODE_ENV,
    watch: development,
    watchOptions: {
      poll: 1000 // Check for changes every second
    }
  }
};

module.exports = config;