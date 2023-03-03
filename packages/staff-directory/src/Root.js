/** @format */
import React from 'react';
import App from './App';
import client from './apollo.config.js';
import { ApolloProvider } from '@teamhub/apollo-config';
import {
  MuiThemeProvider,
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles';
import theme from './utils/theme';

export default function Root(props) {
  return (
    <StylesProvider
      generateClassName={createGenerateClassName({
        productionPrefix: 'teamhub-staff-dir',
        seed: 'teamhub-staff-dir',
      })}
    >
      <MuiThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
}
