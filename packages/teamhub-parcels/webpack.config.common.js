const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const CleanObsoleteChunks = require("webpack-clean-obsolete-chunks");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const DotEnv = require('dotenv-webpack');
module.exports = () => {
  const orgName = "teamhub";
  const projectName = "parcels";

  const REGISTRATION_NAME = `@${orgName}/${projectName}`;

  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName,
  });

  console.log(path.join(__dirname, "src", "teamhub-parcels.js"))

  return merge(defaultConfig, {
    name: REGISTRATION_NAME,

    entry: path.join(__dirname, "src", "teamhub-parcels.js"),

    externals: ["react", "react-dom"],

    module: {
      rules: [
        {
          test: /\.(svg)$/,
          loader: 'url-loader'
        },
      ]
    },

    resolve: {
      modules: [path.resolve(__dirname, "node_modules")],
      alias: {
        "@graphql": path.join(__dirname, "src", "graphql"),
        "@provider": path.join(__dirname, "src", "ParcelProvider.js"),
        "@shared": path.join(__dirname, "src", "shared"),
      },
    },

    plugins: [
      new webpack.DefinePlugin({
        REGISTRATION_NAME: JSON.stringify(REGISTRATION_NAME),
      }),
      new DotEnv({ systemvars: true, safe: true, path: './.env' }),
      new CleanObsoleteChunks(),
    ],
  });
};
