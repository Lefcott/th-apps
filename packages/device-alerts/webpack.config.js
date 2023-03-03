const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const DotEnv = require("dotenv-webpack");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "teamhub",
    projectName: "device-alerts",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    cache: false,
    module: {
      rules: [
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
          loader: "file-loader",
        },
        {
          test: /\.(graphql|gql)$/i,
          exclude: /node_modules/i,
          loader: "graphql-tag/loader",
        },
      ],
    },
    plugins: [new DotEnv({ systemvars: true, safe: true, env: "./.env" })],
  });
};
