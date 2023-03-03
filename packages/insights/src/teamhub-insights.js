import "./set-public-path";
import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import App from "./App";
import {
  MuiThemeProvider,
  createMuiTheme,
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: { useNextVariants: true },
  palette: {
    primary: {
      main: "#4c43db",
    },
    secondary: {
      main: "#cc4c3b",
    },
  },
});

const Wrapped = (props) => (
  <StylesProvider
    generateClassName={createGenerateClassName({ disableGlobal: true })}
  >
    <MuiThemeProvider theme={theme}>
      <App {...props} />
    </MuiThemeProvider>
  </StylesProvider>
);

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Wrapped,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
