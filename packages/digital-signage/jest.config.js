/** @format */

module.exports = {
  rootDir: 'src',
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: [
    '../node_modules/@testing-library/jest-dom/dist/index.js',
  ],
};
