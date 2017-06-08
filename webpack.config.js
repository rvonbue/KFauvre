const webpack = require('webpack');
const path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// require("url?limit=10000!./file.png");

module.exports = {
   entry: './src/js/entry.js',
   output: {
       path: './bin',
       filename: 'app.bundle.js'
   },
   resolve : {
    alias: {
      // bind version of jquery-ui
      "jquery-ui": path.join(__dirname, "jquery-ui/jquery-ui.js"),
       modules: path.join(__dirname, "node_modules"),
    }
  },
	 module: {
     loaders: [
       { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
		   { test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {	presets: ['es2015'] }},
      { test: /\.(jpe?g|png|gif|svg)$/i, exclude: /node_modules/, loader: "url-loader?limit=4096"},
       { test: /\.less$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")},
       { test: /\.html$/, loader: "underscore-template-loader" }
     ]
   },
	 plugins: [
      new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
        compress: {
            warnings: false,
        },
        output: {
            comments: false,
        },
      }),
		new webpack.ProvidePlugin({	_: "underscore", "window._": "underscore" }),
    new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery","window.jQuery": "jquery" }),
    new ExtractTextPlugin('allStyles.css')
    ],
	devServer: {
    contentBase: "./bin",
	  open: true,
	  historyApiFallback: true
	}
 };
