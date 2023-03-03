import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";

import {
  MuiThemeProvider,
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

import client from "./utils/apollo-config";
import theme from "./utils/theme";

export default function ParcelContextProvider(props) {
  return (
    <StylesProvider
      generateClassName={createGenerateClassName({
        productionPrefix: "teamhub-parcel",
        seed: "teamhub-parcel",
      })}
    >
      <MuiThemeProvider theme={theme}>
        <ApolloProvider client={client}>{props.children}</ApolloProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
}
