const { merge } = require("webpack-merge");
const getCommonConfig = require("./webpack.config.common");

module.exports = () => {
  const commonConfig = getCommonConfig()
  return merge(commonConfig, {
    mode: "production",
  });
};
