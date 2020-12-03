module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    jquery: true
  },
  globals: {
    _: 'readonly',
    __: 'readonly',
    ABOVETABLET: 'readonly',
    anime: 'readonly',
    app: 'readonly',
    Atomics: 'readonly',
    axios: 'readonly',
    BASE_URL: 'readonly',
    BELOWTABLET: 'readonly',
    Cookie: 'readonly',
    DESKTOP: 'readonly',
    DEVELOPMENT: 'readonly',
    grecaptcha: 'readonly',
    Headroom: 'readonly',
    is: 'readonly',
    MediaElementPlayer: 'readonly',
    mejs: 'readonly',
    MOBILE: 'readonly',
    Modernizr: 'readonly',
    objectFitImages: 'readonly',
    Pace: 'readonly',
    picturefill: 'readonly',
    Stickyfill: 'readonly',
    swal: 'readonly',
    Swiper: 'readonly',
    TABLET: 'readonly',
    YT: 'readonly',
    Vue: 'readonly',
    Vuex: 'readonly',
    Waypoint: 'readonly'
  },
  extends: ['eslint:recommended', 'plugin:vue/strongly-recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    allowImportExportEverywhere: true
  },
  plugins: ['prettier', 'vue'],
  rules: {
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: true
        }
      }
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never'
        }
      }
    ],
    'vue/html-closing-bracket-newline': [
      'error',
      {
        multiline: 'never'
      }
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  settings: {
    'html/html-extensions': ['.htm', '.html', '.tpl', '.shtm']
  }
}
