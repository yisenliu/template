const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const HtmlCriticalWebpackPlugin = require('./src/assets/vendors/html-critical-webpack-plugin-fork/src')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const IconfontPlugin = require('iconfont-plugin-webpack')
const MediaQueryPlugin = require('media-query-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const SvgStorePlugin = require('external-svg-sprite-loader')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const fs = require('fs')
const path = require('path')
const resolve = path.resolve.bind(path, __dirname)
const webpack = require('webpack')
const PATHS = {
  baseUrl: '/',
  dist: path.join(__dirname, 'dist'),
  fonts: path.join(__dirname, 'public/fonts'),
  public: path.join(__dirname, 'public'),
  relative: false,
  src: path.join(__dirname, 'src')
}
const media = {
  mobile: '(max-width: 47.9375em)',
  tablet: '(min-width: 48em) and (max-width: 64em)',
  belowTablet: 'only screen and (max-width: 64em)',
  aboveTablet: 'only screen and (min-width: 48em)',
  desktop: '(min-width: 64.0625em)'
}

// generate multiple HtmlWebpackPlugins
let htmlFiles = fs.readdirSync(`${PATHS.public}`).filter(file => {
  if (file.indexOf('.shtm') !== -1) return file
})
const htmlBasenames = htmlFiles.map(file => {
  const basename = file.split('.')[0]
  return basename
})

const loaders = {
  cssLoader: {
    loader: 'css-loader',
    options: {
      importLoaders: 4,
      sourceMap: true
    }
  },
  groupCssMediaQueriesLoader: {
    loader: 'group-css-media-queries-loader',
    options: {
      sourceMap: true
    }
  },
  MediaQueryPluginLoader: MediaQueryPlugin.loader,
  postCssLoader: {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      postcssOptions: {
        plugins: ['autoprefixer']
      }
    }
  },
  resolveUrlLoader: {
    loader: 'resolve-url-loader',
    options: {
      // debug: true,
      sourceMap: true,
      keepQuery: true
    }
  },
  sassLoader: {
    loader: 'sass-loader',
    options: {
      additionalData: `@import './src/assets/sass/_global.sass'`,
      sourceMap: true,
      implementation: require('sass'),
      sassOptions: {
        indentedSyntax: true,
        fiber: require('fibers'),
        sourceMap: true,
        outputStyle: 'expanded',
        includePaths: ['src/assets/sass']
      }
    }
  },
  scssLoader: {
    loader: 'sass-loader',
    options: {
      additionalData: `@import './src/assets/sass/_global.sass';`,
      sourceMap: true,
      implementation: require('sass'),
      sassOptions: {
        fiber: require('fibers'),
        sourceMap: true,
        outputStyle: 'expanded',
        includePaths: ['src/assets/sass']
      }
    }
  }
}
const plugins = {
  CleanWebpackPlugin: () => {
    return new CleanWebpackPlugin({
      dry: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!images/favicons/**/*']
    })
  },
  DefinePlugin: env => {
    return new webpack.DefinePlugin({
      BASE_URL: JSON.stringify(PATHS.baseUrl),
      DEVELOPMENT: env.NODE_ENV === 'development',
      MOBILE: JSON.stringify(media.mobile),
      TABLET: JSON.stringify(media.tablet),
      BELOWTABLET: JSON.stringify(media.belowTablet),
      ABOVETABLET: JSON.stringify(media.aboveTablet),
      DESKTOP: JSON.stringify(media.desktop)
    })
  },
  FaviconsWebpackPlugin: () => {
    return new FaviconsWebpackPlugin({
      // https://www.npmjs.com/package/favicons-webpack-plugin
      // https://github.com/jantimon/favicons-webpack-plugin
      logo: './src/assets/images/favicon.png',
      cache: true,
      publicPath: PATHS.relative ? './' : '/',
      prefix: 'images/favicons',
      inject: true,
      mode: 'webapp',
      devMode: 'webapp',
      favicons: {
        appName: 'PharmaEngine',
        appShortName: 'PE',
        appDescription: null,
        developerName: null,
        developerURL: null,
        dir: 'auto',
        lang: 'zh-Hant',
        background: '#fff',
        theme_color: '#fff',
        appleStatusBarStyle: 'black-translucent',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '',
        version: '1.0',
        logging: false,
        pixel_art: false,
        loadManifestWithCredentials: false,
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          windows: false,
          yandex: false
        }
      }
    })
  },
  FriendlyErrorsWebpackPlugin: () => {
    return new FriendlyErrorsWebpackPlugin()
  },
  IconfontPlugin: () => {
    return new IconfontPlugin({
      src: resolve('./src/assets/fonts'),
      family: 'myFont',
      dest: {
        font: resolve('./public/fonts/[family].[type]'),
        css: resolve(
          './src/assets/sass/abstracts/mixins/_iconFontByWebpack.scss'
        )
      },
      watch: {
        pattern: 'src/assets/fonts/**/*.svg',
        cwd: __dirname
      },
      cssTemplate: require('./src/assets/vendors/iconfont-plugin-webpack/template')
    })
  },
  MediaQueryPlugin: () => {
    return new MediaQueryPlugin({
      include: htmlBasenames,
      queries: {
        'only screen and (max-width: 47.9375em)': 'mobile',
        'only screen and (max-width: 47.9375em) and (orientation: landscape)':
          'mobile',
        'only screen and (max-width: 47.9375em) and (orientation: portrait)':
          'mobile',
        'only screen and (min-width: 48em) and (max-width: 64em)': 'tablet',
        'only screen and (min-width: 48em) and (max-width: 64em) and (orientation: landscape)':
          'tablet',
        'only screen and (min-width: 48em) and (max-width: 64em) and (orientation: portrait)':
          'tablet',
        'only screen and (min-width: 64.0625em)': 'desktop'
      }
    })
  },
  MultiHtmlWebpackPlugins: () => {
    return htmlFiles.map(file => {
      const name = file.split('.')[0]
      return new HtmlWebpackPlugin({
        minify: false,
        chunks: [name],
        filename: `${file}`,
        template: `${PATHS.public}/${file}`,
        include: {
          critical: `<!--#include virtual="${PATHS.baseUrl}${name}.critical.tpl" -->`
        }
      })
    })
  },
  MultiHtmlCriticalWebpackPlugins: () => {
    return htmlFiles.map(file => {
      const name = file.split('.')[0]
      return new HtmlCriticalWebpackPlugin(
        {
          base: resolve('dist'),
          src: file,
          dest: file,
          css: [
            // css files to scan
            `./dist/css/${name}.css`
            // `./dist/css/${name}-desktop.css`,
            // `./dist/css/${name}-tablet.css`,
            // `./dist/css/${name}-mobile.css`,
            // `./dist/css/alert.css`,
            // `./dist/css/mediaelement.css`,
            // `./dist/css/swiper.css`,
            // `./dist/css/toast.css`
          ],
          inline: true,
          minify: true,
          extract: true,
          dimensions: [
            {
              width: 414,
              height: 736
            },
            {
              width: 768,
              height: 1024
            },
            {
              width: 1200,
              height: 500
            }
          ],
          penthouse: {
            blockJSRequests: false
          }
        },
        function (html) {
          const criticalCode =
            '<style>' + html.split('<style>')[1].split('</head>')[0]
          const restCode = html.replace(criticalCode, '')
          fs.writeFileSync(`./dist/${name}.critical.tpl`, criticalCode)
          fs.writeFileSync(`./dist/${name}.shtm`, restCode)
        }
      )
    })
  },
  ScriptExtHtmlWebpackPlugin: () => {
    return new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    })
  },
  SvgStorePlugin: () => {
    return new SvgStorePlugin()
  },
  VueLoaderPlugin: () => {
    return new VueLoaderPlugin()
  },
  WebpackProvidePlugin: () => {
    return new webpack.ProvidePlugin({
      // $: 'jquery',
      // jQuery: 'jquery',
      // Vue: 'vue/dist/vue.js',
      app: resolve('./src/assets/js/app.js'),
      anime: 'animejs/lib/anime.js',
      Cookies: 'js-cookie'
      // axios: 'axios'
      // Waypoint: ['waypoints/lib/noframework.waypoints.js', 'waypoints/lib/shortcuts/inview.js']
    })
  }
}

module.exports = {
  loaders,
  PATHS,
  plugins,
  baseWebpackConfig: {
    entry: htmlBasenames.reduce((acc, name) => {
      acc[name] = `./src/js/${name}.js`
      return acc
    }, {}),
    output: {
      path: resolve('dist'),
      publicPath: PATHS.relative ? './' : '/'
    },
    target: 'web',
    // externals: {
    //   jquery: 'jQuery',
    //   vue: 'Vue',
    //   vuex: 'Vuex',
    //   'vue-router': 'VueRouter'
    // },
    resolve: {
      extensions: ['.vue', '.mjs', '.js', '.json'],
      alias: {
        '@': resolve('src')
      }
    },
    module: {
      noParse: /jquery|lodash/,
      rules: [
        {
          test: /\.js$/,
          exclude: [
            resolve('./node_modules/'),
            resolve('./src/assets/html-critical-webpack-plugin-fork')
          ],
          use: ['babel-loader']
        },
        {
          test: /\.(jpe?g|png)$/i,
          include: resolve('./src/assets/responsiveImages/'),
          use: [
            {
              loader: 'responsive-loader',
              options: {
                adapter: require('responsive-loader/sharp'),
                name: '[name]-[width].[ext]',
                outputPath: 'images',
                publicPath: PATHS.relative ? './images/' : '/images/'
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          include: resolve('./src/assets/images/'),
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'images',
                publicPath: PATHS.relative ? './images/' : '/images/',
                esModule: false
              }
            }
          ]
        },
        {
          test: /\.(ogg|mp4|webm)$/i,
          include: resolve('./src/assets/videos/'),
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'videos',
                publicPath: PATHS.relative ? './videos/' : '/videos/',
                esModule: false
              }
            }
          ]
        },
        {
          test: /\.svg$/i,
          include: resolve('./src/assets/sprite/'),
          loader: SvgStorePlugin.loader,
          options: {
            name: 'images/sprite.svg',
            iconName: '[name]-[contenthash]',
            publicPath: PATHS.relative ? './' : '/',
            svgoOptions: {
              plugins: [
                { collapseGroups: true },
                { convertPathData: true },
                { convertStyleToAttrs: true },
                { convertTransform: true },
                { removeDesc: true },
                { removeViewBox: false },
                { removeDimensions: true },
                { convertColors: { shorthex: false } }
              ]
            }
          }
        },
        {
          test: /\.svg$/i,
          include: resolve('./node_modules/'),
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images',
            publicPath: PATHS.relative ? './images/' : '/images/'
          }
        },
        {
          test: /\.svg$/i,
          include: resolve('./src/assets/inlineSVG/'),
          loader: 'svg-inline-loader'
        },
        {
          test: require.resolve('pace-js'),
          use: ['imports-loader?define=>false']
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)$/i,
          include: PATHS.fonts,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts',
                publicPath: PATHS.relative ? '../fonts/' : '/fonts/'
              }
            }
          ]
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },
    optimization: {
      minimizer: [
        new TerserJSPlugin({ cache: true, sourceMap: true }),
        new OptimizeCssAssetsPlugin({})
      ],
      splitChunks: {
        // chunks: 'all',
        cacheGroups: {
          defaultVendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 2,
            minSize: 1000
          },
          styles: {
            name(module, chunks) {
              const allChunksNames = chunks.map(item => item.name).join('~')
              return allChunksNames
            },
            test: /\.css$/i,
            chunks: 'all',
            enforce: true,
            priority: 1
          }
        }
      }
    },
    stats: 'errors-only'
  }
}
