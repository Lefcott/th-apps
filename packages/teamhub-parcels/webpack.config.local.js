const path = require("path");
const Dotenv = require("dotenv-webpack");
const { merge } = require("webpack-merge");
const getCommonConfig = require("./webpack.config.common");

module.exports = () => {
  const commonConfig = getCommonConfig();
  return merge(commonConfig, {
    mode: "development",

    devtool: "cheap-module-source-map",

    plugins: [
      new Dotenv({
        path: path.join(__dirname, ".env"),
      }),
    ],

    devServer: {
      allowedHosts: ["teamhub-staging.k4connect.com"],
      contentBase: path.join(__dirname, "src"),
      port: 9002,
      http2: true,
    },
  });
};
