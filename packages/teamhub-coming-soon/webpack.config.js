const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "teamhub",
    projectName: "coming-soon",
    webpackConfigEnv,
    argv,
  });

  defaultConfig.module.rules = defaultConfig.module.rules.map((rule) => {
    if (String(rule.test) === String(/\.css$/i)) {
      rule.use.forEach((loader) => {
        if (loader.loader.includes("css-loader")) {
          loader.options.modules = {
            // here we're enabling css modules only for css files that have an additional .module. so that stylesheets for
            // rc-swipeout are not affected
            auto: (resourcePath) => resourcePath.endsWith(".module.css"),
          };
        }
      });
    }

    return rule;
  });

  return webpackMerge.smart(defaultConfig, {
    module: {
      rules: [
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
          loader: "file-loader",
        },
      ],
    },
    // modify the webpack config however you'd like to by adding to this object
  });
};
