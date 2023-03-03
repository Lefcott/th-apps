/** @format */

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    babelOptions: {
      configFile: './.babelrc',
    },
  },
  plugins: ['react', 'prettier', 'testing-library'],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
  globals: {
    process: true,
  },
  rules: {
    'react/prop-types': 0,
    semi: 1,
    quotes: [1, 'single'],
    'no-unused-vars': 1,
    'no-fallthrough': 0,
    'react/no-unescaped-entities': 1,
  },
};
