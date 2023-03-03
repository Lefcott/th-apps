const fs = require("fs");
const WebpackBeforeBuildPlugin = require("before-build-webpack");
const ExtraWatchPlugin = require("extra-watch-webpack-plugin");

const { RawSource } = require("webpack-sources");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);

exports.getParcelWebpackConfig = function () {
  switch (process.env.K4_ENV) {
    case "local":
      return require("./src/parcels/webpack.config.local")();
    default:
      return require("./src/parcels/webpack.config.prod")();
  }
};

exports.getAppWebpackConfig = function (parcelWebpackConfig) {
  switch (process.env.K4_ENV) {
    case "local":
      return require("./webpack.config.local")(parcelWebpackConfig);
    default:
      return require("./webpack.config.prod")(parcelWebpackConfig);
  }
};

exports.WaitPlugin = class WaitPlugin extends WebpackBeforeBuildPlugin {
  constructor(file, interval = 1000, timeout = 1000 * 60 * 5) {
    super(function (stats, callback) {
      let start = Date.now();

      function poll() {
        if (fs.existsSync(file)) {
          callback();
        } else if (Date.now() - start > timeout) {
          throw Error("Maybe it just wasn't meant to be.");
        } else {
          console.log("polling", file);
          setTimeout(poll, interval);
        }
      }
      poll();
    });
  }
};

exports.CombineFilesPlugin = class CombineFilesPlugin extends ExtraWatchPlugin {
  constructor(options) {
    super({ files: options.files, dirs: [] });
    this.options = { ...this.options, ...options };
  }

  apply(compiler) {
    super.apply(compiler);
    compiler.hooks.emit.tapPromise(
      "CombineFilesPlugin",
      async (compilation) => {
        const { files, target } = this.options;
        const promises = files.map(async (file) => {
          const source = await readFile(file, "utf8");
          return new RawSource(source + "\n");
        });

        const sources = await Promise.all(promises);
        compilation.assets[target.filename].children.unshift(...sources);
      }
    );
  }
};

exports.SystemImportMapPlugin = class SystemImportMapPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapPromise(
      "SystemImportMapPlugin",
      async (compilation) => {
        const importMap = this.getImportMap();
        const script = this.createImportMapScript(importMap);
        const source = new RawSource([script, "\n"].join(""));
        compilation.assets[this.options.target.filename].children.unshift(
          source
        );
      }
    );
  }

  createImportMapScript(importMap) {
    return `
    (function() {
      var body = document.querySelector("head");
      var script = document.createElement("script");
      script.setAttribute("type", "systemjs-importmap");
      script.textContent = '${JSON.stringify(importMap)}';
      body.append(script);
    })();
    `.trim();
  }

  getImportMap() {
    return { imports: this.options.imports };
  }
};
