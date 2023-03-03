/** @format */

module.exports = {
  rootDir: 'src',
  testTimeout: 15 * 1000,
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },
  testURL: 'https://k4connect.com/login',
  testMatch: ['**/?(*.)+(spec|test).js'],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '@teamhub/api': '<rootDir>/__mocks__/@teamhub/api.js',
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/__tests__/test-utils',
    '<rootDir>/coverage',
  ],
  resetMocks: true,
  collectCoverage: true,
  setupFiles: [require.resolve('whatwg-fetch')],
  setupFilesAfterEnv: [
    '../node_modules/@testing-library/jest-dom/dist/index.js',
    '<rootDir>/__tests__/setupTests.js',
  ],
};
