/** @format */
import React from "react";
import App from "./App";
import client from "./apollo.config.js";
import { ApolloProvider } from "@teamhub/apollo-config";

export default function Root(props) {
  return (
    <ApolloProvider client={client}>
      <App {...props} />
    </ApolloProvider>
  );
}
