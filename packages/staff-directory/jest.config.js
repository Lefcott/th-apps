/** @format */

module.exports = {
  rootDir: 'src',

  testTimeout: 15000,

  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },

  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '@teamhub/apollo-config': '@k4connect/teamhub-apollo-config',
  },

  setupFilesAfterEnv: [
    '../node_modules/@testing-library/jest-dom/dist/index.js',
  ],

  coveragePathIgnorePatterns: ['/src/__tests__/test-utils'],

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
};
