/** @format */

module.exports = {
  rootDir: 'src',
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '@teamhub/api': ' < rootDir > /__mocks__/teamhub - api.js',
    '@teamhub/toast': '<rootDir>/__mocks__teamhub-toast.js',
    '@teamhub/apollo-config': '@k4connect/teamhub-apollo-config',
  },
  setupFilesAfterEnv: [
    '../node_modules/@testing-library/jest-dom/dist/index.js',
  ],
};
