const DotEnv = require('dotenv-webpack');
const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");


module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "teamhub",
    projectName: "resident-check-in-ui",
    webpackConfigEnv,
  });

  defaultConfig.module.rules = defaultConfig.module.rules.map((rule) => {
    if (String(rule.test) === String(/\.css$/i)) {
      rule.use.forEach(loader => {
        if (loader.loader.includes('css-loader')) {
          loader.options.modules = {
            // here we're enabling css modules only for css files that have an additional .module. so that stylesheets for
            // rc-swipeout are not affected
            auto: (resourcePath) => resourcePath.endsWith('.module.css'),
          }
        }
      })
    };

    return rule;
  });
  return webpackMerge.smart(defaultConfig, {
    output: {
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {

          test: /\.(?:jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new DotEnv({ systemvars: true, safe: true, path: './.env' })
    ]
  });
};
