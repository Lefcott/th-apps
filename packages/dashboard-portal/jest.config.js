/** @format */

module.exports = {
  rootDir: 'src',
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css)$': 'identity-obj-proxy',
    '@teamhub/api': '<rootDir>/__mocks__/teamhub-api.js',
  },
  setupFilesAfterEnv: [
    '../node_modules/@testing-library/jest-dom/dist/index.js',
  ],
};
