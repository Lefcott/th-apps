/** @format */
import React from 'react';
import LuxonUtils from '@date-io/luxon';
import { MemoryRouter } from 'react-router-dom';
import {
  MockedProvider,
  MockLink,
  possibleTypes,
  InMemoryCache,
} from '@teamhub/apollo-config';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { theme } from '../../src/theme';

const cache = new InMemoryCache({ possibleTypes, addTypename: true });

// creating a custom mock provider to implement apollo client v2 behavior
// see here https://github.com/apollographql/apollo-client/issues/6559
// and solution https://github.com/apollographql/apollo-client/issues/6559#issuecomment-698495790
// v3.3 will revert the new behavior so this can be removed once that version is released
const MockProvider = ({ cache, children, addTypename, ...props }) => {
  const { mocks } = props;
  const mockLink = new MockLink(mocks, addTypename);
  mockLink.setOnError((errors) => {
    const { graphQLErrors, networkError } = errors;
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );

    if (networkError) console.error(`[Network error]: ${networkError}`);

    if (errors) {
      console.log(errors);
    }
  });
  return (
    <MockedProvider
      link={mockLink}
      cache={cache}
      addTypename={true}
      defaultOptions={{
        watchQuery: { fetchPolicy: 'no-cache' },
        query: { fetchPolicy: 'no-cache' },
      }}
      {...props}
    >
      {children}
    </MockedProvider>
  );
};

function TestContextProvider({ children, apolloProps = {}, routerProps = {} }) {
  return (
    <MockProvider cache={cache} addTypename={true} {...apolloProps}>
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <MuiThemeProvider theme={theme}>
          <MemoryRouter {...routerProps}>{children}</MemoryRouter>
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    </MockProvider>
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
