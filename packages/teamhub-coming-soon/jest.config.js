module.exports = {
  rootDir: "src",
  transform: {
    "^.+\\.(j|t)sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    "@teamhub/api": "<rootDir>/__mocks__/teamhub.mocks.js",
    "\\.(svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  setupFilesAfterEnv: [
    "../node_modules/@testing-library/jest-dom/dist/index.js",
  ],
};
