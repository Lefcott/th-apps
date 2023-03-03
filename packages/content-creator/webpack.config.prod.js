const path = require("path");
const { merge } = require("webpack-merge");
const getCommonConfig = require("./webpack.config.common");
const { CombineFilesPlugin, WaitPlugin } = require("./webpack-utils");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = () => {
  const commonConfig = getCommonConfig();

  return merge(commonConfig, {
    mode: "production",
    optimization: {
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
          terserOptions: {
            mangle: false,
          },
        }),
      ],
    },
  });
};
