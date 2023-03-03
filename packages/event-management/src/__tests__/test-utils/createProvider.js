/** @format */
import React from 'react';
import MomentUtils from '@date-io/moment';
import { MemoryRouter } from 'react-router-dom';
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from '@teamhub/apollo-config';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { theme } from '../../theme';
window.MutationObserver = require('mutation-observer');

function TestContextProvider({ children, routerProps = {} }) {
  const httpLink = createHttpLink({ uri: 'http://localhost:3000/graphql' });
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    name: 'events-management-test',
    cache,
    link: httpLink,
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  });

  return (
    <ApolloProvider client={client}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <MuiThemeProvider theme={theme}>
          <MemoryRouter {...routerProps}>{children}</MemoryRouter>
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    </ApolloProvider>
  );
}

export default function createProvider({
  apolloProps = {},
  routerProps = {},
} = {}) {
  function TestContextProviderWrapper(props) {
    return (
      <TestContextProvider
        apolloProps={apolloProps}
        routerProps={routerProps}
        {...props}
      >
        {props.children}
      </TestContextProvider>
    );
  }
  return TestContextProviderWrapper;
}
