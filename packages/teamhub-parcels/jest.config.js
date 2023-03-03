const path = require('path')

module.exports = {
  testTimeout: 15000,

  transform: {
    '^.+\\js$': 'babel-jest'
  },

  moduleDirectories: ['node_modules'],

  coveragePathIgnorePatterns: ['test-utils', 'setupTests'],

  modulePathIgnorePatterns: ["test-utils", "setupTests"],

  testPathIgnorePatterns: ['/cypress/', 'test-utils', 'setupTests.js'],

  setupFiles: [
    "<rootDir>/__tests__/setupTests.js"
  ],

  setupFilesAfterEnv: [
    '<rootDir>/node_modules/@testing-library/jest-dom/dist/index.js',
  ],

  moduleNameMapper: {
    "^@src(.*)$": "<rootDir>/src$1",
    "^@test-utils(.*)$": "<rootDir>/__tests__/test-utils$1",
    "^@graphql(.*)$": "<rootDir>/src/graphql$1",
    "^@shared(.*)$": "<rootDir>/src/shared$1",
    '^.+\\.svg$': 'identity-obj-proxy',
  },

  collectCoverage: true,
};