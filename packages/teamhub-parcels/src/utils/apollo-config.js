import { ApolloClient } from "apollo-client";
import { ApolloLink, split, concat } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import { onError } from "apollo-link-error";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory";
import introspectionResult from "./fragmentTypes.json";

import { loadApiUrl } from "./environment";
import { parseCookie } from "./url";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionResult,
});

const cache = new InMemoryCache({ fragmentMatcher });

const wsLink = new WebSocketLink({
  uri: loadApiUrl("wss", "subscribe"),
  options: {
    lazy: true, // load only when components actually render
    reconnect: true,
    connectionParams: () => ({
      authToken: `${parseCookie("jwt")}`,
    }),
  },
});

const httpLink = new HttpLink({
  uri: loadApiUrl("https", "graphql"),
  fetch,
});

const authLink = new ApolloLink((operation, forward) => {
  // this will dynamically pull the cookie information
  // rather than only configuring the auth header on 
  // initial bootstrapping of the component
  const token = parseCookie("jwt");
  operation.setContext({
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  return forward(operation);
})

const client = new ApolloClient({
  cache,
  link: new ApolloLink.from([
    authLink,
    onError(({ networkError }) => {
      if (networkError) {
        console.log("network error triggered");
        console.log(networkError)
        if (networkError.stastusCode === 401) {
          window.location.pathname = "/login";
        }
      }
    }),

    split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === "OperationDefinition" && operation === "subscription";
      },
      wsLink,
      httpLink
    ),
  ]),
});

export default client;
