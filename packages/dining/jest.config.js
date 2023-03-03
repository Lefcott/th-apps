/** @format */

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  testTimeout: 15000,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['/node_modules/', '__tests__/'],

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: TBD,

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],

  // Automatically reset mock state between every test
  resetMocks: false,

  // The root directory that Jest should scan for tests and modules within
  rootDir: '.',

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>'],

  // The test environment that will be used for testing
  testEnvironment: 'jest-environment-jsdom',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],

  setupFiles: ['jest-canvas-mock'],

  setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.js'],

  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '@teamhub/api': '<rootDir>/__mocks__/teamhub-api.js',
    '@teamhub/apollo-config': '@k4connect/teamhub-apollo-config',
    '@teamhub/toast': '<rootDir>/__mocks__/teamhub-toast.js',
  },

  globals: {
    React: true,
    'babel-jest': {
      useBabelrc: true,
    },
  },
};
