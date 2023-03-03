/** @format */
import React from "react";
import { MemoryRouter } from "react-router-dom";
import {
  MockedProvider,
  InMemoryCache,
} from "@k4connect/teamhub-apollo-config";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../../utils/theme";

function TestContextProvider({ children, apolloProps = {}, routerProps = {} }) {
  const cache = new InMemoryCache();
  return (
    <MockedProvider cache={cache} addTypename={true} {...apolloProps}>
      <MuiThemeProvider theme={theme}>
        <MemoryRouter {...routerProps}>{children}</MemoryRouter>
      </MuiThemeProvider>
    </MockedProvider>
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
