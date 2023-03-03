/** @format */

const { merge } = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react');
const DotEnv = require('dotenv-webpack');

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: 'teamhub',
    projectName: 'staff-directory',
    webpackConfigEnv,
  });
  // the extension merging doesn't work right, and we need
  // .mjs to be eval'd first for the graphql package imports
  defaultConfig.resolve.extensions = ['.mjs', '.js', '.jsx', '.json'];
  // modify the webpack config however you'd like to by adding to this object
  return merge(defaultConfig, {
    cache: false,
    module: {
      rules: [
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
          loader: 'file-loader',
        },
        {
          test: /\.(graphql|gql)$/i,
          exclude: /node_modules/i,
          loader: 'graphql-tag/loader',
        },
      ],
    },
    plugins: [new DotEnv({ systemvars: true, safe: true })],
  });
};
