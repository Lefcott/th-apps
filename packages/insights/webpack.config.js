const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const DotEnv = require("dotenv-webpack");

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "teamhub",
    projectName: "insights",
    webpackConfigEnv,
  });

  // filter out the default css rule so we can use css modules with a
  // custom rule below
  defaultConfig.module.rules = defaultConfig.module.rules.filter((rule) => {
    if (rule.test) {
      return rule.test.source !== "\\.css$";
    }
    return true;
  });
  const result = merge(defaultConfig, {
    module: {
      rules: [
        {
          test: /\.css$/i,
          include: [/src/],
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
              },
            },
          ],
        },
        {
          test: /\.scss$/i,
          include: [/src/],
          use: [
            "sass-loader"
          ],
        },
        {
          test: /\.css$/i,
          include: [/node_modules/,],
          use: [
            "style-loader",
            {
              loader: "css-loader",
            },
          ],
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
          loader: "file-loader",
        },
      ],
    },
    plugins: [new DotEnv({ path: "./.env", systemvars: true })],
    // modify the webpack config however you'd like to by adding to this object
  });
  return result;
};
