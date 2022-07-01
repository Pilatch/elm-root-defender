# Elm Root Defender

## Problem

Sneaky browser extensions can crash Elm [Browser.Document](https://package.elm-lang.org/packages/elm/browser/latest/Browser#document) and [Browser.Application](https://package.elm-lang.org/packages/elm/browser/latest/Browser#application) apps by mutating the body of your HTML page.  This happens because Elm's Virtual-DOM implementation assumes it has full control over its root node.  In practice, it doesn't because the web is a weird and wooly world.

## Solution

Create an element in your HTML page that's dedicated to your app, rather than letting Elm assume control over the whole body element, and use this Webpack plugin to replace the outputted Elm Virtual-DOM code to look for that element.

In your index.html:

```html
<body>
  <div id="my-app"></div>
</body>
```

In your webpack.config.js, add this plugin like so, where `'my-app'` is the `id` attribute of your app's root node in your HTML.  It could be any valid id attribute string.

```js
new ElmRootDefender('my-app')
```

More complete webpack.config.js for reference:

```js
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
        use: ['style-loader', 'css-loader', 'sass-loader']
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
    new ElmRootDefender('my-app') // This is the good stuff here!
  ],
  target: 'web',
}
```

For even more context, see the source code of our little sample app we use to test this:

https://github.com/Pilatch/elm-root-defender/tree/master/test/sample-project
