const path = require("path");
const { merge } = require("webpack-merge");
const { SystemImportMapPlugin } = require("./webpack-utils");
const getCommonConfig = require("./webpack.config.common");

module.exports = () => {
  const commonConfig = getCommonConfig();

  return merge(commonConfig, {
    mode: "development",

    devtool: "cheap-module-source-map",

    devServer: {
      allowedHosts: ["teamhub-staging.k4connect.com", "teamhub-dev.k4connect.com", "teamhub.k4connect.com"],
      port: 9001,
      http2: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },
  });
};
