/** @format */

import React from 'react';
import { Container } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const AppContainer = withStyles({
  root: {
    height: 'calc(100% - 54px) !important',
    margin: '48px auto 24px',
    '@media (max-width: 960px)': {
      margin: '0 !important',
    },
  },
})(Container);

export default function BaseAppContainer({ children }) {
  return <AppContainer>{children}</AppContainer>;
}
