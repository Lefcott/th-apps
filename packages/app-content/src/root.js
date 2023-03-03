/** @format */

import 'core-js/stable';
import React from 'react';
import App from './App';
import { theme } from './theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import locale from 'date-fns/locale/en-US';
import { ApolloProvider } from '@teamhub/apollo-config';
import client from './apollo.config';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Root() {
  if (locale.options) {
    locale.options.weekStartsOn = 0;
  }

  return (
    <ApolloProvider client={client}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    </ApolloProvider>
  );
}
