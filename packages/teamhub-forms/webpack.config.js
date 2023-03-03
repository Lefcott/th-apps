const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const DotenvWebpackPlugin = require("dotenv-webpack");

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "teamhub",
    projectName: "forms",
    webpackConfigEnv,
  });

  return webpackMerge.smart(defaultConfig, {
    plugins: [
      new DotenvWebpackPlugin({
        systemvars: true,
        path: "./.env",
      }),
    ],
  });
};
