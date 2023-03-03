/** @format */

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    babelOptions: {
      configFile: './babel.config.json',
    },
  },
  plugins: ['react', 'prettier'],
  globals: {
    _: 'readonly',
  },
  extends: [
    'eslint:recommended',
    'plugin:react/jsx-runtime',
    'prettier',
    'plugin:react/recommended',
  ],
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
    'no-fallthrough': 0,
    'react/no-unescaped-entities': 1,
  },
};
