const gulp = require('gulp')

function imageOptimization() {
  const imagemin = require('gulp-imagemin')
  const plumber = require('gulp-plumber')

  return gulp
    .src('dist/images/**/*.{gif,jpg,jpeg,png,svg}')
    .pipe(plumber())
    .pipe(
      imagemin(
        [
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 60, progressive: false }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: false }, { cleanupIDs: false }]
          })
        ],
        {
          verbose: true
        }
      )
    )
    .pipe(gulp.dest('dist/images'))
}

async function expressServer() {
  const compression = require('compression')
  const connectSSI = require('connect-ssi')
  const express = require('express')
  const internalIp = require('internal-ip')
  const open = require('open')
  const selfSigned = require('openssl-self-signed-certificate')
  const spdy = require('spdy')
  const ssiMiddleware = require('ssi-middleware')
  const { createProxyMiddleware } = require('http-proxy-middleware')
  const app = express()
  const port = 3001
  const options = {
    key: selfSigned.key,
    cert: selfSigned.cert
  }
  const myIp = await internalIp.v4()

  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://localhost:3000',
      changeOrigin: true,
      secure: false
    })
  )
  app.use(compression())
  app.use(
    connectSSI({
      ext: '.shtm',
      baseDir: __dirname + '/dist'
    })
  )
  app.use(
    ssiMiddleware({
      baseDir: __dirname + '/dist',
      baseUrl: `https://${myIp}:${port}`,
      request: {
        strictSSL: false,
        gzip: false
      }
    })
  )
  app.use('/', express.static('dist'))
  app.get(/[a-z]/, function (req, res, next) {
    const reqUrl = req.originalUrl
    const lastChar = reqUrl.charAt(reqUrl.length - 1)
    res.set('Content-Type', 'text/html')
    if (lastChar === '/') {
      res.sendFile(`${reqUrl}index.shtm`, { root: 'dist' })
    } else if (!reqUrl.includes('googleapis') && !reqUrl.includes('json')) {
      res.sendFile(`${reqUrl}.shtm`, { root: 'dist' })
    } else {
      next()
    }
  })

  spdy.createServer(options, app).listen(port, function () {
    console.log(`(alt + click) to open => https://${myIp}:${port}/`)
    open(`https://${myIp}:${port}/contact`)
  })
}

exports.expressServer = expressServer
exports.imageOptimization = imageOptimization
