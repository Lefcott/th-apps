/** @format */

const webpackMerge = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react');
const DotEnv = require('dotenv-webpack');

module.exports = (webpackConfigEnv) => {
  const defaultOptions = {
    orgName: 'teamhub',
    projectName: 'content-library',
    webpackConfigEnv,
  };
  const defaultConfig = singleSpaDefaults(defaultOptions);
  defaultConfig.resolve.extensions = ['.mjs', '.js', '.jsx', '.json'];
  // removing default rule for css files
  defaultConfig.module.rules = defaultConfig.module.rules.filter((rule) => {
    return String(rule.test) !== String(/\.css$/i);
  });

  return webpackMerge.smart(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    module: {
      rules: [
        // new css rule that includes mini css extract plugin for prod
        {
          test: /\.css$/i,
          include: [/node_modules/, /src/],
          loader: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: (resourcePath) => resourcePath.endsWith('.module.css'),
                },
              },
            },
          ],
        },
        {
          test: /\.(?:jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$/i,
          loader: 'file-loader',
        },
      ],
    },
    plugins: [new DotEnv({ systemvars: true, safe: true, path: './.env' })],
  });
};
