const path = require('path');
const critical = require('critical');

class HtmlCriticalWebpackPlugin {

  constructor(options,callback) {
    this.options = options;
    this.userCallback =  callback;
  }

  emit(compilation, callback) {
    const css = Object.keys(compilation.assets)
      .filter(function (filename) { return /\.css$/.test(filename); })
      .map(function (filename) { return path.join(compilation.outputOptions.path, filename); });

    critical.generate(Object.assign({ css }, this.options), (err,html) => {
      callback(err);
      this.userCallback(html);
    });
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('HtmlCriticalWebpackPlugin', (compilation, callback) => {
      this.emit(compilation, callback);
    });
  }
  
}

module.exports = HtmlCriticalWebpackPlugin;