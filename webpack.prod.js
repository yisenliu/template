const { loaders, plugins, baseWebpackConfig } = require('./webpack.common')
const { merge } = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = env => {
  return merge(baseWebpackConfig, {
    mode: 'production',
    devtool: 'none',
    output: {
      filename: 'js/[name].js?[hash:8]',
      chunkFilename: 'js/[name].js?[contenthash]'
    },
    module: {
      rules: [
        {
          test: /\.sass$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: false,
                reloadAll: true
              }
            },
            loaders.cssLoader,
            loaders.postCssLoader,
            loaders.resolveUrlLoader,
            loaders.groupCssMediaQueriesLoader,
            loaders.sassLoader
          ]
        },
        {
          test: /\.s?css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: false,
                reloadAll: true
              }
            },
            loaders.cssLoader,
            loaders.postCssLoader,
            loaders.resolveUrlLoader,
            loaders.groupCssMediaQueriesLoader,
            loaders.scssLoader
          ]
        }
      ]
    },
    plugins: [
      plugins.CleanWebpackPlugin(),
      plugins.VueLoaderPlugin(),
      plugins.DefinePlugin(env),
      plugins.FriendlyErrorsWebpackPlugin(),
      plugins.WebpackProvidePlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css?[contenthash]',
        chunkFilename: 'css/[name].css?[contenthash]'
      }),
      plugins.SvgStorePlugin(),
      new CopyWebpackPlugin([
        // {
        //   from: './node_modules/animate.css/animate.min.css',
        //   to: './vendors/',
        //   toType: 'dir'
        // },
        // {
        //   from: './node_modules/vue/dist/vue.runtime.min.js',
        //   to: './vendors/',
        //   toType: 'dir'
        // },
        // {
        //   from: './node_modules/vue-router/dist/vue-router.min.js',
        //   to: './vendors/',
        //   toType: 'dir'
        // },
        // {
        //   from: './node_modules/vuex/dist/vuex.min.js',
        //   to: './vendors/',
        //   toType: 'dir'
        // },
        // {
        //   from: './public/js/libs/jquery.min.js',
        //   to: './js/libs/jquery.min.js',
        //   toType: 'file',
        // },
        {
          from: './src/db',
          to: './db'
        }
      ]),
      ...plugins.MultiHtmlWebpackPlugins(),
      plugins.FaviconsWebpackPlugin(),
      ...plugins.MultiHtmlCriticalWebpackPlugins(),
      plugins.ScriptExtHtmlWebpackPlugin()
    ]
  })
}
