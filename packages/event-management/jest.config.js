/** @format */

module.exports = {
  rootDir: 'src',
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },

  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '@teamhub/api': '<rootDir>/__mocks__/teamhub-api.mock.js',
    '@teamhub/toast': '<rootDir>/__mocks__/teamhub-toast.mock.js',
    '@teamhub/apollo-config': '@k4connect/teamhub-apollo-config',
  },
  testPathIgnorePatterns: ['<rootDir>/__tests__/test-utils'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  setupFiles: [require.resolve('node-fetch')],
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.js',
    '../node_modules/@testing-library/jest-dom/dist/index.js',
  ],
};
