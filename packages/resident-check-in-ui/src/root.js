import React from "react";
import "url-search-params-polyfill";
import "./styles/swipeoutOverrides.css";
import "rc-swipeout/assets/index.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "element-scroll-polyfill";
import {
  createGenerateClassName,
  StylesProvider,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import { ApolloProvider } from "@teamhub/apollo-config";
import App from "./App";
import client from './apollo.config.js';

const theme = createMuiTheme({
  typography: { useNextVariants: true },
  palette: {
    primary: {
      main: "#4c43db",
    },
    secondary: {
      main: "#ce4b35",
    },
  },
});

export default function Root() {
  return (
    <StylesProvider
      generateClassName={createGenerateClassName({
        productionPrefix: "teamhub-checkin",
        seed: "teamhub-checkin",
      })}
    >
      <MuiThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
}
