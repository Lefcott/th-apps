import React from 'react';
import { theme } from '../../src/theme';
import {
  MockedProvider,
  InMemoryCache,
  possibleTypes,
} from '@teamhub/apollo-config';
import { MuiThemeProvider } from '@material-ui/core/styles';

const cache = new InMemoryCache({ possibleTypes });

export default function createTestContextProvider({ apolloProps = {} }) {
  return function TestContextProvider({ children }) {
    return (
      <MockedProvider cache={cache} addTypename={true} {...apolloProps}>
        <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
      </MockedProvider>
    );
  };
}
