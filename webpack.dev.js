const {
  loaders,
  PATHS,
  plugins,
  baseWebpackConfig
} = require('./webpack.common')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = env => {
  return merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'eval-cheap-source-map',
    devServer: {
      contentBase: [PATHS.src, PATHS.public, PATHS.dist],
      historyApiFallback: {
        rewrites: [
          { from: /^\/$/, to: '/index.shtm' },
          { from: /^\/about$/, to: '/about.shtm' }
        ]
      },
      hot: true,
      host: '0.0.0.0',
      // https: true,
      open: true,
      openPage: '',
      port: 8000,
      // proxy: {
      //   '/api': {
      //     target: 'https://localhost:3000',
      //     changeOrigin: true,
      //     secure: false
      //   }
      // },
      publicPath: '/',
      useLocalIp: true,
      watchContentBase: true
    },
    output: {
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js'
    },
    module: {
      rules: [
        {
          test: /\.sass$/,
          use: [
            'style-loader',
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
            'style-loader',
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
      plugins.VueLoaderPlugin(),
      plugins.DefinePlugin(env),
      plugins.FriendlyErrorsWebpackPlugin(),
      plugins.WebpackProvidePlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].css'
      }),
      plugins.IconfontPlugin(),
      plugins.SvgStorePlugin(),
      ...plugins.MultiHtmlWebpackPlugins(),
      plugins.FaviconsWebpackPlugin(),
      plugins.ScriptExtHtmlWebpackPlugin()
    ]
  })
}
