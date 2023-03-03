/** @format */
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider, InMemoryCache } from "@teamhub/apollo-config";

function TestContextProvider({ children, apolloProps = {}, routerProps = {} }) {
  const cache = new InMemoryCache();
  const { mocks, localState } = apolloProps;

  return (
    <MockedProvider
      cache={cache}
      mocks={mocks}
      localState={localState}
      addTypename={true}
    >
      <MemoryRouter {...routerProps}>{children}</MemoryRouter>
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
