/** @format */

import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
// memory router is recommended for tests and non-browser envs
// https://reactrouter.com/native/api/MemoryRouter
import { MemoryRouter } from 'react-router-dom';
import theme from '../../utils/theme';

export default function createMockProvider({ routerProps = {} }) {
  return function TestContextProvider({ children }) {
    return (
      <MuiThemeProvider theme={theme}>
        <MemoryRouter {...routerProps}>{children}</MemoryRouter>
      </MuiThemeProvider>
    );
  };
}
