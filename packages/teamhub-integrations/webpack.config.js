const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const DotEnv = require("dotenv-webpack");
const webpack = require("webpack");
module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "teamhub",
    projectName: "integrations",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    plugins: [new DotEnv({ path: "./.env", systemvars: true })],
  });
};
