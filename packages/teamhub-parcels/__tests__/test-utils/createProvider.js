/** @format */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import {
  IntrospectionFragmentMatcher,
  InMemoryCache,
} from 'apollo-cache-inmemory';
import theme from '@src/utils/theme';
import introspectionResult from "@src/utils/fragmentTypes.json";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionResult,
});

const cache = new InMemoryCache({ fragmentMatcher });

function TestContextProvider({ children, apolloProps = {}}) {

  return (
    <StylesProvider>
      <MuiThemeProvider theme={theme}>
          <MockedProvider cache={cache} addTypename={true} {...apolloProps}>
            {children}
        </MockedProvider>
      </MuiThemeProvider>
    </StylesProvider>
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
