/** @format */

import 'core-js/stable';
import React from 'react';
import App from './App';
import { theme } from './theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import { ApolloProvider } from '@teamhub/apollo-config';
import client from './apollo.config';

export default function Root() {
  return (
    <ApolloProvider client={client}>
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    </ApolloProvider>
  );
}
