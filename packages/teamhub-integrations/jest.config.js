module.exports = {
  rootDir: "src",
  transform: {
    "^.+\\.(j|t)sx?$": "babel-jest",
    "^.+\\.svg$": "jest-svg-transformer",
  },
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    "\\.(png|jpeg|jpg)$": "<rootDir>/__mocks__/fileMock.js",
    "@teamhub/api": "<rootDir>/__mocks__/api.js",
    "@teamhub/toast": "<rootDir>/__mocks__/api.js",
    "@teamhub/apollo-config": "@k4connect/teamhub-apollo-config",
    "use-fetch": "<rootDir>/__mocks__/use-fetch.js",
  },
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleDirectories: ["node_modules", "src"],
  transformIgnorePatterns: ["node_modules/@material-ui"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
