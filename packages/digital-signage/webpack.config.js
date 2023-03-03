/** @format */

const webpackMerge = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react');
const DotEnv = require('dotenv-webpack');
module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: 'teamhub',
    projectName: 'digital-signage',
    webpackConfigEnv,
  });

  return webpackMerge.smart(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    module: {
      rules: [
        {
          test: /\.(?:jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$/i,
          loader: 'file-loader',
        },
      ],
    },
    plugins: [new DotEnv({ systemvars: true, path: './.env', safe: true })],
  });
};
