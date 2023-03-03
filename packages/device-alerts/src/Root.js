/** @format */
import React from "react";
import App from "./App";
import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";
import client from "./apollo.config.js";
import { ApolloProvider } from "@teamhub/apollo-config";

export default function Root(props) {
  return (
    <StylesProvider
      generateClassName={createGenerateClassName({
        productionPrefix: "teamhub-device-alerts",
        seed: "teamhub-device-alerts",
      })}
    >
      <ApolloProvider client={client}>
        <App {...props} />
      </ApolloProvider>
    </StylesProvider>
  );
}
