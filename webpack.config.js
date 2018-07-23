var webpack = require('webpack');
var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';

var atlOptions = 'transpileOnly=true';

module.exports = function makeWebpackConfig() {
  var config = {
    mode: isProd ? 'production' : 'development',

    entry: {
      'polyfills': './app/polyfills.ts',
      'vendor': './app/vendor.ts',
      'admin': './app/admin/main.ts'
    },

    output: {
      path: root('dist'),
      publicPath: '/ban-may-bay/dist',
      filename: 'js/[name].js',
      chunkFilename: '[name].chunk.js'

    },

    resolve: {
      extensions: ['.ts', '.js']
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          loaders: ['awesome-typescript-loader?' + atlOptions, 'angular2-template-loader'],
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
          loader: 'file-loader?name=assets/[name].[hash].[ext]'
        },
        {
          test: /\.css$/,
          exclude: root('app'),
          loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?sourceMap' })
        },
        {
          test: /\.css$/,
          include: root('app'),
          loader: 'raw-loader'
        },
        {
          test: /\.scss$/,
          include: root('app'),
          loader: ['raw-loader', 'sass-loader']
        }
      ]
    },

    plugins: [
      // Workaround for angular/angular#11580
      new webpack.ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)@angular/,
        root('./app'), // location of your src
        {} // a map of your routes
      ),
      new HtmlWebpackPlugin({
        template: 'app/admin/admin.html',
        chunksSortMode: 'dependency',
        filename: root('admin.html')
      }),
      // new ExtractTextPlugin('style.css')
    ],

    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
          chunks: "initial",
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          // minSize: 0 // This is example is too small to create commons chunks
        },
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          priority: 10,
          enforce: true
        }
        }
      }
    }
  };

  return config;
}();

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}