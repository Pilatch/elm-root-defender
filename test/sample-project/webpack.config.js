const HtmlWebpackPlugin = require('html-webpack-plugin')
const ElmRootDefender = require('../../index')
const path = require('path')

module.exports = {
  devServer: {
    compress: false,
    https: false,
    port: 8000,
    static: {
      directory: path.join(__dirname, 'dist')
    },
    watchFiles: ['src/**/*.elm', 'src/**/*.js', 'src/**/*.html', 'src/**/*.css']
  },
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/, /review/],
        use: 'elm-webpack-loader'
      }, {
        test: /\.s[ac]ss$/i,
        use: [
          // creates style nodes, translates css to commonjs, compiles sass
          'style-loader', 'css-loader', 'sass-loader'
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new ElmRootDefender('my-app')
  ],
  target: 'web',
}
