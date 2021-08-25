const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
 mode: 'development',
 entry: {
   index: './src/index.js',
 },
 devtool: 'inline-source-map',
 devServer: {
   static: './dist',
 },
 module: {
 rules: [
  {
    test: /\.pgn/i,
    use: 'raw-loader',
  },
  ],
},
 plugins: [
   new HtmlWebpackPlugin({
     title: 'Development',
     template: 'src/index.html'
   }),
   new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    })
 ],
 output: {
   filename: '[name].bundle.js',
   path: path.resolve(__dirname, 'dist'),
   clean: true,
 },
};

