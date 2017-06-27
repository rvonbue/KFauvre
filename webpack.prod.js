const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'typetest.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve : {
    alias: {
      // bind version of jquery-ui
      "jquery-ui": path.join(__dirname, "jquery-ui/jquery-ui.js"),
       modules: path.join(__dirname, "node_modules"),
    }
  },
  module: {
    rules: [
      { test: /\.js$/,
        include: path.join(__dirname, 'src'),
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['env',"es2015"] }
        }
      },
      {
          test: require.resolve('jquery'),
          use: [{
              loader: 'expose-loader',
              options: 'jQuery'
          },{
              loader: 'expose-loader',
              options: '$'
          }]
      },
      {test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: ["css-loader", "less-loader"],
          fallback: "style-loader",
        })
      },
      { test: /\.html$/, loader: "underscore-template-loader" }
    ]
  },
  plugins: [
    new ExtractTextPlugin("typeteststyles.css"),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.ProvidePlugin({	_: "underscore", "window._": "underscore" }),
    new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery","window.jQuery": "jquery" }),
    new webpack.optimize.UglifyJsPlugin(),
  //   new webpack.optimize.UglifyJsPlugin({
  //     beautify: false,
  //     mangle: {
  //       screw_ie8: true,
  //       keep_fnames: true
  //     },
  //     compress: {
  //       screw_ie8: true
  //     },
  //     comments: false
  //   })
  ]
};
