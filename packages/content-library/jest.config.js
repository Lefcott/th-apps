module.exports = {
  testTimeout: 10000,
  rootDir: '.',
  roots: ['<rootDir>'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css)$': 'identity-obj-proxy',
    '@teamhub/api': '<rootDir>/__mocks__/teamhub-api.js',
    '@teamhub/apollo-config': '@k4connect/teamhub-apollo-config',
    '@teamhub/toast': '<rootDir>/__mocks__/teamhub-toast.js',
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.js'],
  globals: {
    React: true,
    'babel-jest': {
      useBabelrc: true,
    },
  },
};
